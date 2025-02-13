use alloy::signers::{icp::IcpSigner, Signer};

use crate::{
    auth_guard, create_derivation_path, get_ecdsa_key_name, utils::get_principal_in_scope,
};

#[ic_cdk::update]
pub async fn get_address(as_agent: Option<bool>) -> Result<String, String> {
    auth_guard()?;
    let principal = get_principal_in_scope(as_agent)?;

    // Setup signer
    let ecdsa_key_name = get_ecdsa_key_name();
    let derivation_path = create_derivation_path(&principal);
    let signer = IcpSigner::new(derivation_path, &ecdsa_key_name, None)
        .await
        .map_err(|e| e.to_string())?;

    let address = signer.address();
    Ok(address.to_string())
}
