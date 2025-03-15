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
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(data.updated_at));
  }

  return <div>Última atualização {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
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
