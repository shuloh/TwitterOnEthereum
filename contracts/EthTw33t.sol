pragma solidity 0.5.12;



/// @author Jordan Loh Shu Peng
contract EthTw33t {
    struct Comment {
        address author;
        string comment;
        uint256 commentId;
    }
    struct Tweet {
        address author;
        string message;
        uint256 tweetId;
        bool retweeted;
        uint256 retweetId; //default to 0 if false
        uint256[] comments;
    }

    mapping(uint256 => Tweet) public tweets;
    uint256 public nTweets;
    mapping(uint256 => Comment) public comments;
    uint256 public nComments;
    mapping(address => bool) public registered;
    mapping(address => string) public  addressUserName;
    mapping(string => bool) private _uniqueUsers;
    bytes32 private _emptyString;



    constructor() public {
        _emptyString = keccak256((abi.encodePacked("")));
    }

    // function numComments(uint256 tweetId) view public returns(uint256) {
    //     require(tweets.length > tweetId, "tweetId not found to get comments");
    //     return tweets[tweetId].comments.length;
    // }
    function isRegUser() public view returns (bool) {
        return registered[msg.sender];
    }

    function tweetCommentLength(uint256 tweetId) public view 
        validTweet(tweetId) returns (uint256) {
        return tweets[tweetId].comments.length;
    }

    function getTweetCommentId(uint256 tweetId, uint256 index) public view 
        validTweet(tweetId)
        returns (uint256) {
            return tweets[tweetId].comments[index];
    }

    modifier regUser() {
        require(isRegUser(), "user is not registered");
        _;
    }

     modifier validTweet(uint256 id) {
         require(_tweetExists(id), "tweet Id not found");
         _;
     }

     modifier validComment(uint256 id) {
         require(_commentExists(id), "comment Id not found");
         _;
     }

     modifier validString(string memory m) {
         require(_notEmptyString(m), "invalid string argument");
         _;
     }

    function register(string memory userName) public 
        validString(userName) {

        require(registered[msg.sender] == false, "user has already registered");
        require(_uniqueUsers[userName] == false, "userName has been taken");
        registered[msg.sender] = true;
        addressUserName[msg.sender] = userName;
        _uniqueUsers[userName] = true;
    }

    function retweet(string memory _message, uint256 retweetId) public 
        regUser 
        validString(_message)
        validTweet(retweetId) {

        _tweet(_message, true, retweetId);
    }

    function tweet(string memory _message) public 
        regUser
        validString(_message) {

        _tweet(_message, false, 0);
    }

    function comment( uint256 tweetId, string memory _comment) public 
        regUser
        validTweet(tweetId)
        validString(_comment) {

        Comment memory c;    
        c.author = msg.sender;
        c.comment = _comment;
        c.commentId = nComments;
        tweets[tweetId].comments.push(nComments);
        comments[nComments++] = c;
    }

    function _tweet(
        string memory _message,
        bool _retweeted,
        uint256 _retweetId
    ) internal {

        Tweet memory nt;    
        nt.author = msg.sender;
        nt.message = _message;
        nt.tweetId = nTweets;
        nt.retweeted = _retweeted;
        nt.retweetId = _retweetId;
        tweets[nTweets++] = nt;
    }

    function _notEmptyString(string memory payload) internal view returns (bool) {
        return keccak256(abi.encodePacked(payload)) != _emptyString;
    }

    function _tweetExists(uint256 tweetId) internal view returns (bool) {
        return tweetId < nTweets;
    }

    function _commentExists(uint256 commentId) internal view returns (bool) {
        return commentId < nComments;
    }

}