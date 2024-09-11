<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;

class LikedMoviesController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'movie_id' => 'required|int',
        ]);

        $movie = Movie::firstOrCreate([
            "tmdb_id" => $request->movie_id,
        ]);


        $request->user()->likedMovies()->attach($movie->id);

        return to_route('dashboard');
    }

    public function destroy(Request $request, string $id)
    {

        $movie = Movie::firstWhere([
            'tmdb_id' => $id,
        ]);

        $request->user()->likedMovies()->detach($movie->id);

        return to_route('dashboard');
    }
}
