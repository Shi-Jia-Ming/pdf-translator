use tauri::command;
use crate::database::index::get_app_db_connection;
use crate::database::module;

pub fn set_translate_api(name: String, url: String, token: String) {
    let connection = get_app_db_connection().expect("failed to initialize app database");
    module::translate_api::set_translate_api(&connection, &name, &url, &token).expect("failed to set translate api");
}

#[command]
pub fn update_translate_api(name: String, url: String, token: String) {
    let connection = get_app_db_connection().expect("failed to initialize app database");
    match module::translate_api::update_translate_api(&connection, 1, &name, &url, &token) {
        Err(_e) => {
            println!("failed to update translate api, setting new one");
            set_translate_api(name, url, token);
        },
        Ok(_) => {}
    };
}

#[command]
pub fn get_translate_api() -> module::translate_api::TranslateAPI {
    let connection = get_app_db_connection().expect("failed to initialize app database");
    module::translate_api::get_translate_api(&connection, 1).unwrap_or_else(|_e| {
        println!("failed to get translate api, setting new one");
        set_translate_api(String::new(), String::new(), String::new());
        module::translate_api::TranslateAPI {
            id: 1,
            name: "".to_string(),
            url: "".to_string(),
            token: "".to_string()
        }
    })
}