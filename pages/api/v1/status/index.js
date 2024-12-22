import database from "infra/databse.js";
async function status(request, response) {
	const result = await database.query("SELECT 1 + 1 as SUM;");
	console.log(result.rows);
	response.status(200).json({chave: "olá"});
}

export default status;
