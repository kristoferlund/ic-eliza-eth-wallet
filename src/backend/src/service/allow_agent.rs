use crate::{auth_guard, utils::principal_to_blob, ALLOWED_AGENTS};
use candid::Principal;

#[ic_cdk::update]
pub async fn allow_agent(allowed_agent: String) -> Result<String, String> {
    auth_guard()?;

    // The allowing principal is the caller of the function
    let allowing_principal = principal_to_blob(ic_cdk::caller());

    // The agent principal is the principal that will be allowed
    let allowed_principal =
        Principal::from_text(allowed_agent.clone()).map_err(|e| e.to_string())?;
    let allowed_principal = principal_to_blob(allowed_principal);

    // Make the agent principal an allowed agent of this principal
    ALLOWED_AGENTS.with_borrow_mut(|allowed_agents| {
        allowed_agents.insert(allowing_principal, allowed_principal);
    });

    Ok(allowed_agent)
}
