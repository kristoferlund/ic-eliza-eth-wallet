mod service;
mod utils;

use alloy::transports::icp::{RpcApi, RpcService};
use candid::{CandidType, Decode, Deserialize, Encode, Nat, Principal};
use ic_cdk::export_candid;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::storable::{Blob, Bound};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use serde_bytes::ByteBuf;
use std::borrow::Cow;
use std::cell::RefCell;

// ICP uses different ECDSA key names for mainnet and local
// development.
fn get_ecdsa_key_name() -> String {
    #[allow(clippy::option_env_unwrap)]
    let dfx_network = option_env!("DFX_NETWORK").unwrap();
    match dfx_network {
        "local" => "dfx_test_key".to_string(),
        "ic" => "key_1".to_string(),
        _ => panic!("Unsupported network."),
    }
}

// Modify this function to determine which EVM network canister connects to
fn get_rpc_service() -> RpcService {
    // RpcService::EthSepolia(EthSepoliaService::Alchemy)
    // RpcService::EthMainnet(EthMainnetService::Alchemy)
    // RpcService::BaseMainnet(L2MainnetService::Alchemy)
    // RpcService::OptimismMainnet(L2MainnetService::Alchemy)
    // RpcService::ArbitrumOne(L2MainnetService::Alchemy)
    RpcService::Custom(RpcApi {
        url: "https://ic-alloy-evm-rpc-proxy.kristofer-977.workers.dev/eth-sepolia".to_string(),
        headers: None,
    })
}

// The derivation path determines the Ethereum address generated
// by the signer.
fn create_derivation_path(principal: &Principal) -> Vec<Vec<u8>> {
    const SCHEMA_V1: u8 = 1;
    [
        ByteBuf::from(vec![SCHEMA_V1]),
        ByteBuf::from(principal.as_slice().to_vec()),
    ]
    .iter()
    .map(|x| x.to_vec())
    .collect()
}

fn auth_guard() -> Result<(), String> {
    match ic_cdk::caller() {
        caller if caller == Principal::anonymous() => {
            Err("Calls with the anonymous principal are not allowed.".to_string())
        }
        _ => Ok(()),
    }
}

type Memory = VirtualMemory<DefaultMemoryImpl>;

#[derive(CandidType, Deserialize, Debug, Clone)]
struct AgentRules {
    wait_time_minutes: u64,
    max_transaction_amount: Nat,
}

impl Storable for AgentRules {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

const AGENT_TO_WALLET_MEMORY_ID: MemoryId = MemoryId::new(0);
const WALLET_TO_AGENT_MEMORY_ID: MemoryId = MemoryId::new(1);
const AGENT_RULES_MEMORY_ID: MemoryId = MemoryId::new(2);
const AGENT_LATEST_TX_TIME_MEMORY_ID: MemoryId = MemoryId::new(3);

type Timestamp = u64;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static AGENT_TO_WALLET: RefCell<StableBTreeMap<Blob<29>, Blob<29>, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(AGENT_TO_WALLET_MEMORY_ID)),
        )
    );

    static WALLET_TO_AGENT: RefCell<StableBTreeMap<Blob<29>, Blob<29>, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(WALLET_TO_AGENT_MEMORY_ID)),
        )
    );

    static AGENT_RULES: RefCell<StableBTreeMap<Blob<29>, AgentRules, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(AGENT_RULES_MEMORY_ID)),
        )
    );

    static AGENT_LATEST_TX_TIME: RefCell<StableBTreeMap<Blob<29>, Timestamp, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(AGENT_LATEST_TX_TIME_MEMORY_ID)),
        )
    );
}

export_candid!();
