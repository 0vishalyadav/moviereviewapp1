import { Platform } from "react-native";
import { Account, Client, Databases } from "react-native-appwrite";

const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  col: {
    savedMovies: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID_SAVED_MOVES!,
  },
};

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

switch (Platform.OS) {
  case "android":
    client.setPlatform("com.rohanberadev.movieapp");
    break;
  case "ios":
}

const database = new Databases(client);

const account = new Account(client);

const savedMoviesAttr = {
  userId: "userId",
  movieId: "movieId",
  posterPath: "posterPath",
  movieTitle: "movieTitle",
  voteAverage: "voteAverage",
  releasedData: "releasedDate",
};

export { account, client, config, database, savedMoviesAttr };
