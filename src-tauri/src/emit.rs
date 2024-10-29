use tauri::{command, AppHandle, Manager};

#[command]
pub fn open_setting_window(app: AppHandle) {
    app.emit_to("main", "open_setting_window", {}).unwrap();
}