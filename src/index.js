const fs = require("fs");
const { request, gql } = require("graphql-request");

const main = async () => {
  const dataPath = "./clearing_account_balances.json";
  const accountList = JSON.parse(fs.readFileSync(dataPath).toString());

  // 对于每一个账户，获得它的收益
  const endpoint = "https://********";
  const allObject = {};

  for (const item of accountList) {
    const account = item._id;
    const query = gql`
    {
        integratedDividendData(
        account: "${account}"
      ) {
        unClaimedDividend
        claimedDividend
      }
    }
  `;

    const data = await request(endpoint, query);
    // console.log(`data: ${JSON.stringify(data)}`);
    allObject[account] = {};
    allObject[account]["unClaimedDividend"] =
      data.integratedDividendData.unClaimedDividend;
    allObject[account]["claimedDividend"] =
      data.integratedDividendData.claimedDividend;
  }

  fs.writeFileSync(`allVethDividends.json`, JSON.stringify(allObject));
};

main();
