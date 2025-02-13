use candid::Principal;
use ic_stable_structures::storable::Blob;

use crate::AGENT_TO_WALLET;

pub fn principal_to_blob(principal: Principal) -> Blob<29> {
    principal.as_slice()[..29].try_into().unwrap()
}

pub fn get_principal_in_scope(as_agent: Option<bool>) -> Result<Principal, String> {
    let caller = ic_cdk::caller();

    // If caller is not acting as an agent, the caller is the principal in scope
    if as_agent.is_none_or(|a| !a) {
        return Ok(caller);
    }

    // Otherwise, the principal in scope is the wallet principal linked to the calling agent
    let maybe_principal =
        AGENT_TO_WALLET.with_borrow(|agents| agents.get(&principal_to_blob(caller)));

    // If no principal is found, the calling agent has not yet been linked to a wallet
    match maybe_principal {
        Some(principal) => Ok(Principal::from_slice(principal.as_slice())),
        None => Err("Calling agent has not been linked to a wallet".to_string()),
    }
}
