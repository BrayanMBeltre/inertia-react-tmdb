import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getPopularMovies } from "@/lib/tmdb";
import type { PageProps } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard({
	auth,
	likes,
}: PageProps<{
	likes: Array<{ id: number; tmdb_id: number }>;
}>) {
	const query = useQuery({
		queryKey: ["popularMovies"],
		queryFn: () => getPopularMovies({ page: 1 }),
	});

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
		isLiked: boolean,
	) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget).entries();

		const data = Object.fromEntries(formData);

		if (isLiked) {
			router.delete(`/likes/${data.movie_id}`, {
				preserveScroll: true,
			});
			return;
		}

		router.post("/likes", data, {
			preserveScroll: true,
		});
	};

	return (
		<AuthenticatedLayout
			user={auth.user}
			header={
				<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
					Dashboard
				</h2>
			}
		>
			<Head title="Dashboard" />

			<div className="py-12">
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					<div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900 dark:text-gray-100">
							{query.isLoading && <div>Loading...</div>}
							{query.isError && <div>Error: {query.error.message}</div>}

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{query.isSuccess &&
									query.data.data.results.map((movie) => {
										const isLiked = likes.some(
											(like) => Number(like.tmdb_id) === Number(movie.id),
										);

										return (
											<Card key={movie.id}>
												<CardHeader>
													<CardTitle>{movie.title}</CardTitle>
													<CardDescription className="line-clamp-3">
														{movie.overview}
													</CardDescription>
												</CardHeader>

												<CardContent className="mx-auto w-full">
													<img
														src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
														alt={movie.title}
														className="w-full h-[400px] object-cover rounded"
													/>
												</CardContent>

												<CardFooter>
													<form onSubmit={(e) => handleSubmit(e, isLiked)}>
														<input
															type="hidden"
															name="movie_id"
															value={movie.id}
														/>

														<Button
															type="submit"
															className="ml-auto"
															variant={isLiked ? "destructive" : "default"}
														>
															{isLiked ? "Unlike" : "Like"}
														</Button>
													</form>
												</CardFooter>
											</Card>
										);
									})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
