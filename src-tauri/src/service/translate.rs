use tauri::command;
use crate::database::index::init_app_database;
use crate::database::module;

pub fn set_translate_api(name: String, url: String, token: String) {
    let connection = init_app_database().expect("failed to initialize app database");
    module::translate_api::set_translate_api(&connection, &name, &url, &token).expect("failed to set translate api");
}

#[command]
pub fn update_translate_api(name: String, url: String, token: String) {
    let connection = init_app_database().expect("failed to initialize app database");
    match module::translate_api::update_translate_api(&connection, 1, &name, &url, &token) {
        Err(_e) => {
            set_translate_api(name, url, token);
        },
        Ok(_) => {}
    };
}

#[command]
pub fn get_translate_api() -> module::translate_api::TranslateAPI {
    let connection = init_app_database().expect("failed to initialize app database");
    module::translate_api::get_translate_api(&connection, 1).expect("failed to get translate api")
}