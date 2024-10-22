use std::io::Read;

use tauri::command;

#[command]
pub fn load_pdf_file(file_path: &str) -> String {
    let file = std::fs::File::open(file_path).unwrap();
    let reader = std::io::BufReader::new(file);
    let data: Vec<u8> = reader.bytes().map(|b| b.unwrap()).collect();

    base64::encode(data)
}
