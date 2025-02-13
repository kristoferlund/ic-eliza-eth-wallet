use crate::{auth_guard, utils::principal_to_blob, WALLET_TO_AGENT};
use candid::Principal;
use ic_stable_structures::Storable;

#[ic_cdk::query]
pub async fn get_agent() -> Result<Option<String>, String> {
    auth_guard()?;

    let wallet = principal_to_blob(ic_cdk::caller());
    let agent = WALLET_TO_AGENT.with_borrow(|wa| wa.get(&wallet));

    match agent {
        Some(agent) => Ok(Some(Principal::from_bytes(agent.to_bytes()).to_string())),
        None => Ok(None),
    }
}
