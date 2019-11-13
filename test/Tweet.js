const EthTw33t = artifacts.require("EthTw33t");

contract("EthTw33t", async function(accounts) {
  before(async function() {
    this.Alice = accounts[0];
    this.Bob = accounts[1];
    this.contract = await EthTw33t.deployed();
  });

  it("register user", async function() {
    await this.contract.register("Alice", { from: this.Alice });
    await this.contract.register("Bob", { from: this.Bob });
    const got = await this.contract.isRegUser.call({ from: this.Alice });
    assert(got, "user is registered after calling register()");
    const got2 = await this.contract.isRegUser.call({ from: this.Bob });
    assert(got2, "user is registered after calling register()");
  });

  it("tweet hello", async function() {
    await this.contract.tweet("hello from Alice");
    const result = await this.contract.tweets.call(0, { from: this.Alice });
    const got = result.message;
    const want = "hello from Alice";
    assert.equal(got, want);
  });

  it("tweet world", async function() {
    await this.contract.tweet("hello from Bob");
    const result = await this.contract.tweets.call(1, { from: this.Bob });
    const got = result.message;
    const want = "hello from Bob";
    assert.equal(got, want);
  });

  it("nTweets = 2", async function() {
    const got = await this.contract.nTweets.call({ from: this.Alice });
    const want = 2;
    assert.equal(got, want);
  });

  it("comments", async function() {
    await this.contract.comment(0, "nice Alice", { from: this.Bob });
    await this.contract.comment(1, "nice Bob", { from: this.Alice });
    await this.contract.comment(0, "thanks Bob", { from: this.Alice });
    //get number of comments from alice's tweet (tweetId = 0)
    const got = await this.contract.tweetCommentLength.call(0, {
      from: this.Alice
    });
    const want = 2;
    assert.equal(got, want);
    //the first comment on alice's tweet should point to global comments id 0
    //the second comment on alice's tweet should point to global comments id 2
    //id 1 was used for the comment on Bob's tweet.
    let gotId = await this.contract.getTweetCommentId.call(0, 0, {
      from: this.Alice
    });
    let wantId = 0;
    assert.equal(gotId, wantId);
    gotId = await this.contract.getTweetCommentId.call(0, 1, {
      from: this.Alice
    });
    wantId = 2;
    assert.equal(gotId, wantId);
  });
});
