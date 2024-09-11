import axios from "axios";

export type TMDBAPIERROR = {
    status_code: number;
    status_message: string;
    success: boolean;
};

const tmdbApi = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDP_ACCESS_TOKEN}`,
    },
});

export type PopularMoviesParams = {
    include_adult?: boolean;
    include_video?: boolean;
    language?: string;
    page?: number;
    sort_by?: string;
};

export type PopularMoviesResponse = {
    page: number;
    results: Array<{
        adult: boolean;
        backdrop_path: string;
        genre_ids: Array<number>;
        id: number;
        original_language: string;
        original_title: string;
        overview: string;
        popularity: number;
        poster_path: string;
        release_date: string;
        title: string;
        video: boolean;
        vote_average: number;
        vote_count: number;
    }>;
    total_pages: number;
    total_results: number;
};

export const getPopularMovies = async (params: PopularMoviesParams) => {
    return tmdbApi.get<PopularMoviesResponse>("/movie/popular", { params });
};
