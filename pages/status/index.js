import useSWR from "swr";

async function fetchAPI(key) {
	const response = await fetch(key);
	const responseBody = await response.json();

	return responseBody;
}

export default function StatusPage() {
	return (
		<>
			<h1>Status</h1>
			<UpdatedAt />
			<Database />
		</>
	);
}

function UpdatedAt() {
	const {isLoading, data} = useSWR("api/v1/status", fetchAPI, {
		refreshInterval: 2000,
	});

	let updatedAtText = "Carregando...";

	if (!isLoading && data) {
		updatedAtText = new Date(data.updated_at).toLocaleDateString("pt-BR");
	}

	return <div>Última atualização {updatedAtText}</div>;
}

function Database() {
	const {isLoading, data} = useSWR("api/v1/status", fetchAPI, {
		refreshInterval: 2000,
	});

	if (isLoading && !data) {
		return "Carregando ...";
	}

	const database = data.dependencies.database;

	return (
		<>
			<h3>Banco de dados</h3>
			<p>
				<strong>Versão</strong>: {database.version}
			</p>
			<p>
				<strong>Máximo de conexões</strong>: {database.max_connections}
			</p>
			<p>
				<strong>Conexões abertas</strong>: {database.opened_connections}
			</p>
		</>
	);
}

