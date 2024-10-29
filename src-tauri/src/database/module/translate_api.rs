use rusqlite::{Connection, Result};
use serde::Serialize;

#[derive(Serialize, Debug)]
pub struct TranslateAPI {
    pub(crate) id: i32,
    pub(crate) name: String,
    pub(crate) url: String,
    pub(crate) token: String
}

pub fn init_translate_table(connection: &Connection) -> rusqlite::Result<()> {
    connection.execute(
        "CREATE TABLE IF NOT EXISTS translate (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            token TEXT NOT NULL
        )",
        [],
    )?;
    Ok(())
}

pub fn set_translate_api(connection: &Connection, name: &str, url: &str, token: &str) -> rusqlite::Result<()> {
    connection.execute(
        "INSERT INTO translate (name, url, token) VALUES (?1, ?2, ?3)",
        [name, url, token],
    )?;
    Ok(())
}

pub fn update_translate_api(connection: &Connection, id: i32, name: &str, url: &str, token: &str) -> rusqlite::Result<()> {
    connection.execute(
        "UPDATE translate SET name = ?1, url = ?2, token = ?3 WHERE id = ?4",
        [name, url, token, &id.to_string()],
    )?;
    Ok(())
}

pub fn get_translate_api(connection: &Connection, id: i32) -> Result<TranslateAPI> {
    let mut stmt = connection.prepare("SELECT * FROM translate WHERE id = ?1")?;
    let mut rows = stmt.query([id])?;
    let row = match rows.next()? {
        None => {return Err(rusqlite::Error::QueryReturnedNoRows)},
        Some(row) => {row}
    };
    Ok(TranslateAPI {
        id: row.get(0)?,
        name: row.get(1)?,
        url: row.get(2)?,
        token: row.get(3)?
    })
}