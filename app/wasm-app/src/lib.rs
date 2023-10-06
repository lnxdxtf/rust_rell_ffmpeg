mod utils;
use rust_reel::{rust_reel_service_client::RustReelServiceClient, RustReelRequest};
use tonic_web_wasm_client::Client;
use wasm_bindgen::prelude::*;
mod rust_reel {
    include!("./proto/rust_reel.rs");
}
#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub async fn test_grpc() {
    let mut client = build_client();
    let req = RustReelRequest {
        name: "test".to_string(),
    };
    let response = client.test(req).await.unwrap();
    alert(&format!("RESPONSE={:?}", response));
}

fn build_client() -> RustReelServiceClient<Client> {
    let addr = format!("http://{}:{}", "127.0.0.1", "50051");
    let client_web = Client::new(addr);
    RustReelServiceClient::new(client_web)
}
