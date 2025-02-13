use crate::{auth_guard, utils::principal_to_blob, AGENT_TO_WALLET, WALLET_TO_AGENT};
use candid::Principal;

#[ic_cdk::update]
pub async fn set_agent(agent_principal: String) -> Result<String, String> {
    auth_guard()?;

    let agent_principal = Principal::from_text(agent_principal).map_err(|e| e.to_string())?;

    let agent = principal_to_blob(agent_principal);
    let wallet = principal_to_blob(ic_cdk::caller());

    // Link agent to wallet
    AGENT_TO_WALLET.with_borrow_mut(|aw| {
        aw.insert(agent, wallet);
    });

    // Link wallet to agent
    WALLET_TO_AGENT.with_borrow_mut(|wa| {
        wa.insert(wallet, agent);
    });

    Ok(agent_principal.to_string())
}
