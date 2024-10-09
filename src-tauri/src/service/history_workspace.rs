use tauri::command;

#[command]
pub fn init_history_file() {
    let data_path = tauri::api::path::app_data_dir(tauri::generate_context!().config()).unwrap();
    let data_file = data_path.join("history.json");
    if !data_file.exists() {
        std::fs::write(data_file, "[]").unwrap();
    }
}


#[command]
pub fn read_history_file() -> String {
    let data_path = tauri::api::path::app_data_dir(tauri::generate_context!().config()).unwrap();
    let data_file = data_path.join("history.json");
    std::fs::read_to_string(data_file).unwrap()
}

#[command]
pub fn write_history_file(data: String) {
    let data_path = tauri::api::path::app_data_dir(tauri::generate_context!().config()).unwrap();
    let data_file = data_path.join("history.json");
    std::fs::write(data_file, data).unwrap();
}