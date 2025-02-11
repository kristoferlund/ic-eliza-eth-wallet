use crate::{auth_guard, utils::principal_to_blob, ALLOWED_AGENTS};
use candid::Principal;
use ic_stable_structures::Storable;

#[ic_cdk::query]
pub async fn get_allowed_agent() -> Result<String, String> {
    auth_guard()?;

    // The allowing principal is the caller of the function
    let allowing_principal = principal_to_blob(ic_cdk::caller());

    let allowed_agent =
        ALLOWED_AGENTS.with_borrow(|allowed_agents| allowed_agents.get(&allowing_principal));

    match allowed_agent {
        Some(agent) => Ok(Principal::from_bytes(agent.to_bytes()).to_string()),
        None => Ok("".to_string()),
    }
}
