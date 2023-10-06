fn main() {
    tonic_build::configure()
        .build_server(false)
        .build_client(true)
        .out_dir("src/proto/")
        .compile(
            &[
                "../../proto/rust_reel.proto",
                // "../proto/google/protobuf/empty.proto",
            ],
            &["../../proto/"], // specify the root location to search proto dependencies
        )
        .unwrap();
}
