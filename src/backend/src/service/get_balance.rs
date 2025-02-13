use crate::{
    auth_guard, create_derivation_path, get_ecdsa_key_name, get_rpc_service,
    utils::get_principal_in_scope,
};
use alloy::{
    providers::{Provider, ProviderBuilder},
    signers::{icp::IcpSigner, Signer},
    transports::icp::IcpConfig,
};

#[ic_cdk::update]
async fn get_balance(as_agent: Option<bool>) -> Result<String, String> {
    auth_guard()?;
    let principal = get_principal_in_scope(as_agent)?;

    // Setup signer
    let ecdsa_key_name = get_ecdsa_key_name();
    let derivation_path = create_derivation_path(&principal);
    let signer = IcpSigner::new(derivation_path, &ecdsa_key_name, None)
        .await
        .map_err(|e| e.to_string())?;

    // Setup provider
    let rpc_service = get_rpc_service();
    let config = IcpConfig::new(rpc_service);
    let provider = ProviderBuilder::new().on_icp(config);

    // Get balance for signer address
    let address = signer.address();
    let result = provider.get_balance(address).await;

    match result {
        Ok(balance) => Ok(balance.to_string()),
        Err(e) => Err(e.to_string()),
    }
}
