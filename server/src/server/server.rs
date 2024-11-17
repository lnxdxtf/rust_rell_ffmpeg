use std::time::Duration;

use http::header::HeaderName;
use services::rust_reel::service::rust_reel::rust_reel_service_server::RustReelServiceServer;
use tonic::transport::Server;
use tonic_web::GrpcWebLayer;
use tower_http::cors::{AllowOrigin, CorsLayer};

extern crate dotenv;
#[macro_use]
extern crate dotenv_codegen;

mod services;

#[tokio::main]
async fn main() {
    let addr = format!(
        "{}:{}",
        dotenv!("RUST_REEL_SERVER_HOST"),
        dotenv!("RUST_REEL_SERVER_PORT")
    );
    println!("✅Server Tonic gRPC running on http://{}", &addr);
    let service_rust_reel = services::rust_reel::service::RustReelServiceApp {};
    let _server = Server::builder()
        .accept_http1(true)
        .layer(build_layer_cors())
        .layer(GrpcWebLayer::new())
        .add_service(RustReelServiceServer::new(service_rust_reel))
        .serve(addr.parse().expect("Cannot parse address"))
        .await
        .unwrap();
}

const DEFAULT_MAX_AGE: Duration = Duration::from_secs(24 * 60 * 60);
const DEFAULT_EXPOSED_HEADERS: [&str; 3] =
    ["grpc-status", "grpc-message", "grpc-status-details-bin"];
const DEFAULT_ALLOW_HEADERS: [&str; 4] =
    ["x-grpc-web", "content-type", "x-user-agent", "grpc-timeout"];
fn build_layer_cors() -> CorsLayer {
    CorsLayer::new()
        .allow_origin(AllowOrigin::any())
        .allow_credentials(false)
        .max_age(DEFAULT_MAX_AGE)
        .expose_headers(
            DEFAULT_EXPOSED_HEADERS
                .iter()
                .cloned()
                .map(HeaderName::from_static)
                .collect::<Vec<HeaderName>>(),
        )
        .allow_headers(
            DEFAULT_ALLOW_HEADERS
                .iter()
                .cloned()
                .map(HeaderName::from_static)
                .collect::<Vec<HeaderName>>(),
        )
}
