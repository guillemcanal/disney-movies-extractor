# Extract Disney's movies from Wikipedia

## Usage

Using the provided Docker image

```bash
make run
```

> **ℹ Info**: More commands are availables. Use `make help` to show them all

On your local machine

```bash
npm install
# start extracting disney movies in the directory specified by $EXPORT_DIRECTORY
npm start
```

> **ℹ Info**: Disney's movies data will be available in the `./extracted` directory

## Configure

| Env name             | Description                                                         | Default value |
| -------------------- | ------------------------------------------------------------------- | ------------- |
| CRAWLER_CONCURRENCY  | Number of concurrent connexions                                     | 10            |
| CRAWLER_LIMIT_MOVIES | Limit the number of movies to extract (usefull in development mode) | Infinity      |
| EXPORT_DIRECTORY     | Path where movies data and images should be extracted               | ./extracted   |

> **ℹ Note**: In development mode, it's recommanded to edit those environement variables in the `.env.development` dotfile

## Package scripts

| Name         | Description                                 | Purpose     |
| ------------ | ------------------------------------------- | ----------- |
| build        | Build the project in the `./dist` directory | production  |
| watch        | Watch the project                           | development |
| watch:run    | Watch and run the project                   | development |
| watch:node   | Watch changes on the `./dist` folder        | development |
| watch:parcel | Same as `watch`                             | development |

> **🛑 Caution**:  `watch:node` Shouldn't be used standalone, it's a dependency of `watch:run`
