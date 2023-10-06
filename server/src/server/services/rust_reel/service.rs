use tonic::Response;

use self::rust_reel::{
    rust_reel_service_server::RustReelService, RustReelRequest, RustReelResponse,
};

pub mod rust_reel {
    include!("../../../proto/rust_reel.rs");
}

pub struct RustReelServiceApp {}
#[tonic::async_trait]
impl RustReelService for RustReelServiceApp {
    async fn test(
        &self,
        request: tonic::Request<RustReelRequest>,
    ) -> Result<tonic::Response<RustReelResponse>, tonic::Status> {
        println!("Got a request from {:?}", request.remote_addr());
        Ok(Response::new(RustReelResponse {
            message: "Ok server ok".to_string(),
        }))
    }
}
