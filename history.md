# jsonstor-mongodb
[`@liquicode/jsonstor-mongodb`](https://github.com/liquicode/jsonstor-mongodb)


# Project History


v0.2.0 (current)
---------------------------------------------------------------------

- Built on `@liquicode/jsonstor` 0.2.0 and `@liquicode/jsongin` 0.2.0. A criteria the engine
  refuses is refused before the storage acts on it.
- `FindMany2()` takes a `Paging` object, `{ SkipCount, MaxCount }`, as well as a number.
- `StorageInfo()` reports the adapter asked for, the dialect in force and the server version.
- Tested on MongoDB 4.4, 5.0, 6.0, 7.0 and 8.3; 4.4 is the oldest version supported.
- `FindOne` applies its projection. *Was: ignored it.*
- `InsertMany( [] )` answers `0`. *Was: refused.*
- `$jsonSchema` is passed to the server.
- Declares Node.js `>=12.9.0` in `engines`.


v0.1.0 (2026-08-31)
---------------------------------------------------------------------

- Built on `@liquicode/jsonstor` 0.1.0 and `@liquicode/jsongin` 0.1.0.


v0.0.20 (2024-05-20)
---------------------------------------------------------------------

- Added function: FindMany2( Criteria, Projection, Sort, MaxCount, Options )
- Updated npm library `@liquicode/jsonstor` to `v0.0.20`.
- Updated npm library `@liquicode/jsongin` to `v0.0.20`.


v0.0.1 (2023-11-26)
---------------------------------------------------------------------

- Initial release.
