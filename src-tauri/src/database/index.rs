use rusqlite::{Connection, Result};
use crate::database::module::translate_api::init_translate_table;

pub fn init_app_database() -> Result<Connection> {
    let connection: Connection = get_app_db_connection()?;
    init_translate_table(&connection)?;
    Ok(connection)
}

pub fn get_app_db_connection() -> Result<Connection> {
    let app_dir = tauri::api::path::app_data_dir(tauri::generate_context!().config()).unwrap();
    let db_file = app_dir.join("app.db");
    Connection::open(db_file)
}