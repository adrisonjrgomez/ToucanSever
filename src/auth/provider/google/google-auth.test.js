const { getUrlConsernGoogle, Client, getUserDataFromGoogle } = require("./google.auth");
const axios = require("axios").default;
test("getUrlConcernGoogle works", () => {
  const client = Client();
  const url = getUrlConsernGoogle(client);
  expect(url).toMatch(new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/));
});

describe("getUserDataFromGoogle", () => {
  const code = "THIS IS A VALID CODE GENERATED BY GOOGLE";
  it("should work correclty", async () => {
    const mockClient = {
      getToken: (code) => Promise.resolve({ tokens: { access_tokken: "TOKEN_VALID", refresh_token: "TOKEN_VALID" } }),
      setCredentials: (tokens) => {},
    };
    const mockOauthService = {
      userinfo: { get: () => Promise.resolve({ data: { userid: 1 } }) },
    };
    const data = await getUserDataFromGoogle(code, mockClient, mockOauthService);
    expect(data.userid).toBe(1);
  });

  it("should not work correctly, code not valid or connection fail getting tokken", async () => {
    const code = "THIS IS A NOT VALID CODE GENERATED BY GOOGLE";
    const mockClient = {
      getToken: (code) => Promise.reject({}),
    };
    const mockOauthService = {};
    const data = await getUserDataFromGoogle(code, mockClient, mockOauthService);
    expect(data).toBeFalsy();
  });

  it("should not work correctly, connection fail getting user data", async () => {
    const code = "THIS IS A NOT VALID CODE GENERATED BY GOOGLE";
    const mockClient = {
      getToken: (code) => Promise.resolve({ tokens: {} }),
      setCredentials: () => {},
    };
    const mockOauthService = {
      userinfo: { get: () => Promise.reject() },
    };
    const data = await getUserDataFromGoogle(code, mockClient, mockOauthService);
    expect(data).toBeFalsy();
  });
});
