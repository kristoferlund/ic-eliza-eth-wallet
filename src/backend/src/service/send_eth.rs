use crate::{
    auth_guard, create_derivation_path, get_ecdsa_key_name, get_rpc_service,
    utils::{get_principal_in_scope, principal_to_blob},
    AGENT_LATEST_TX_TIME, AGENT_RULES,
};
use alloy::{
    network::{EthereumWallet, TransactionBuilder, TxSigner},
    primitives::{Address, U256},
    providers::{Provider, ProviderBuilder},
    rpc::types::request::TransactionRequest,
    signers::icp::IcpSigner,
    transports::icp::IcpConfig,
};
use candid::Nat;
use std::{cell::RefCell, collections::HashMap};

// To minimize the number of nonce requests, we store the latest nonce for each wallet
// address in a thread-local HashMap.
thread_local! {
    static ADDRESS_NONCES: RefCell<HashMap<Address, u64>> = RefCell::new(HashMap::new());
}

#[ic_cdk::update]
async fn send_eth(
    to_address: String,
    amount: Nat,
    as_agent: Option<bool>,
) -> Result<String, String> {
    // Calls to send_eth need to be authenticated
    auth_guard()?;

    // From address is the method caller or the principal managed by the agent
    let from_principal = get_principal_in_scope(as_agent)?;

    // If the caller is an agent, make sure the transaction is allowed
    if as_agent.is_some_and(|a| a) {
        let agent_rules = AGENT_RULES.with_borrow(|ar| ar.get(&principal_to_blob(from_principal)));

        match agent_rules {
            Some(rules) => {
                if amount > rules.max_transaction_amount {
                    return Err(
                        "Transaction amount exceeds agent's max_transaction_amount.".to_string()
                    );
                }

                let now = ic_cdk::api::time();
                let latest_tx_time = AGENT_LATEST_TX_TIME
                    .with_borrow(|ltx| ltx.get(&principal_to_blob(ic_cdk::caller())))
                    .unwrap_or(0);

                if now < latest_tx_time + rules.wait_time_minutes * 60 * 1_000_000_000 {
                    return Err(format!(
                        "Transaction too soon. Wait at least {} minutes.",
                        rules.wait_time_minutes,
                    ));
                }
            }
            None => {
                return Err("No agent rules set, action denied by default.".to_string());
            }
        }
    }

    // Make sure we have a correct to address
    let to_address = Address::parse_checksummed(to_address, None).map_err(|e| e.to_string())?;

    // Setup signer
    let ecdsa_key_name = get_ecdsa_key_name();
    let derivation_path = create_derivation_path(&from_principal);
    let signer = IcpSigner::new(derivation_path, &ecdsa_key_name, None)
        .await
        .map_err(|e| e.to_string())?;
    let from_address = signer.address();

    // Setup provider
    let wallet = EthereumWallet::from(signer);
    let rpc_service = get_rpc_service();
    let config = IcpConfig::new(rpc_service);
    let provider = ProviderBuilder::new()
        .with_gas_estimation()
        .wallet(wallet)
        .on_icp(config);

    // Attempt to get nonce from thread-local storage
    let maybe_nonce = ADDRESS_NONCES.with_borrow(|nonces| {
        // If a nonce exists, the next nonce to use is latest nonce + 1
        nonces.get(&from_address).map(|nonce| nonce + 1)
    });

    // If no nonce exists, get it from the provider
    let nonce = if let Some(nonce) = maybe_nonce {
        nonce
    } else {
        provider
            .get_transaction_count(from_address)
            .await
            .unwrap_or(0)
    };

    // Create transaction
    let transaction_request = TransactionRequest::default()
        .with_to(to_address)
        .with_value(U256::from_le_slice(amount.0.to_bytes_le().as_slice()))
        .with_nonce(nonce)
        .with_gas_limit(21_000)
        .with_chain_id(11155111);

    // Send transaction
    let result = provider.send_transaction(transaction_request.clone()).await;

    match result {
        Ok(pending_tx_builder) => {
            let tx_hash = *pending_tx_builder.tx_hash();
            let tx_response = provider.get_transaction_by_hash(tx_hash).await.unwrap();

            match tx_response {
                Some(tx) => {
                    // The transaction has been mined and included in a block, the nonce
                    // has been consumed. Save it to thread-local storage. Next transaction
                    // for this address will use a nonce that is = this nonce + 1
                    ADDRESS_NONCES.with_borrow_mut(|nonces| {
                        nonces.insert(from_address, tx.nonce);
                    });

                    // If the caller is an agent, save the transaction time
                    if as_agent.is_some_and(|a| a) {
                        AGENT_LATEST_TX_TIME.with_borrow_mut(|ltx| {
                            ltx.insert(principal_to_blob(ic_cdk::caller()), ic_cdk::api::time());
                        });
                    }

                    Ok(format!("{:?}", tx))
                }
                None => Err("Could not get transaction.".to_string()),
            }
        }
        Err(e) => Err(e.to_string()),
    }
}
