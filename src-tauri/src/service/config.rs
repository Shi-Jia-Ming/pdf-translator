use tauri::command;

#[command]
pub fn init_app_dir() {
    let app_dir = tauri::api::path::app_data_dir(tauri::generate_context!().config()).unwrap();
    if !app_dir.exists() {
        std::fs::create_dir_all(app_dir).unwrap();
    }
}
