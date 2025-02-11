use candid::Principal;
use ic_stable_structures::storable::Blob;

pub fn principal_to_blob(principal: Principal) -> Blob<29> {
    principal.as_slice()[..29].try_into().unwrap()
}
