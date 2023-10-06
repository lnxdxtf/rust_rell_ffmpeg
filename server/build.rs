fn main() {
    tonic_build::configure()
        .build_server(true)
        .build_client(false)
        .out_dir("src/proto/")
        .compile(
            &[
                "../proto/rust_reel.proto",
                // "../proto/google/protobuf/empty.proto",
            ],
            &["../proto/"], // specify the root location to search proto dependencies
        )
        .unwrap();
}
