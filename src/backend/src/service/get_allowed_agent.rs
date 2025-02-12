use crate::{auth_guard, utils::principal_to_blob, ALLOWED_AGENTS};
use candid::Principal;
use ic_stable_structures::Storable;

#[ic_cdk::query]
pub async fn get_allowed_agent() -> Result<Option<String>, String> {
    auth_guard()?;

    let allowing_principal = principal_to_blob(ic_cdk::caller());

    let allowed_agent = ALLOWED_AGENTS.with_borrow(|agents| agents.get(&allowing_principal));

    match allowed_agent {
        Some(agent) => Ok(Some(Principal::from_bytes(agent.to_bytes()).to_string())),
        None => Ok(None),
    }
}
