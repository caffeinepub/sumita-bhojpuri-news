import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Article type
  type Article = {
    id : Nat;
    title : Text;
    description : Text;
    content : Text;
    category : Text;
    imageUrl : Text;
    date : Text;
    isFeatured : Bool;
    isTrending : Bool;
  };

  // Persistent storage for articles
  let articles = Map.empty<Nat, Article>();
  var nextId = 1;

  // Fill articles with sample data at initialization (admin only)
  public shared ({ caller }) func init() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize articles");
    };

    let sampleArticles = [
      {
        title = "Khesari Lal Yadav's New Movie Released";
        description = "Khesari Lal Yadav's highly anticipated movie was released today";
        content = "The film beautifully showcases Bhojpuri culture. Audiences loved the movie and theaters saw huge crowds.";
        category = "Bhojpuri Cinema";
        imageUrl = "https://example.com/images/khesari.jpg";
        date = "2024-06-10";
        isFeatured = true;
        isTrending = false;
      },
      {
        title = "Pawan Singh Wins Best Actor Award";
        description = "Pawan Singh received an award for his outstanding acting";
        content = "Pawan Singh said it's possible because of his fans. He thanked his team and family.";
        category = "Bhojpuri Cinema";
        imageUrl = "https://example.com/images/pawan.jpg";
        date = "2024-06-08";
        isFeatured = false;
        isTrending = true;
      },
      {
        title = "Wedding Video Goes Viral on Social Media";
        description = "A wedding video has made people laugh";
        content = "The video features funny antics of the bride and groom. Millions have shared and commented on it.";
        category = "Viral News";
        imageUrl = "https://example.com/images/viral1.jpg";
        date = "2024-06-09";
        isFeatured = false;
        isTrending = true;
      },
      {
        title = "Bizarre Weather Footage Goes Viral";
        description = "People continued activities despite heavy rains";
        content = "People had fun with umbrellas and raincoats. This video went viral on social media.";
        category = "Viral News";
        imageUrl = "https://example.com/images/viral2.jpg";
        date = "2024-06-07";
        isFeatured = true;
        isTrending = false;
      },
      {
        title = "Government Statement on New Education Policy";
        description = "Government provided detailed information about the new education policy";
        content = "The new policy will bring revolutionary changes to the education sector.";
        category = "Politics";
        imageUrl = "https://example.com/images/politics1.jpg";
        date = "2024-06-06";
        isFeatured = true;
        isTrending = false;
      },
      {
        title = "Political Leaders' Meeting Concludes";
        description = "Many major leaders discussed political issues";
        content = "The meeting aimed to find solutions collaboratively. All parties assured cooperation.";
        category = "Politics";
        imageUrl = "https://example.com/images/politics2.jpg";
        date = "2024-06-05";
        isFeatured = false;
        isTrending = true;
      },
      {
        title = "Interview with a Superstar";
        description = "Special conversation with a film industry superstar";
        content = "He talked openly about his life and career, sharing how his family supported him during tough times.";
        category = "Interview";
        imageUrl = "https://example.com/images/interview1.jpg";
        date = "2024-06-04";
        isFeatured = true;
        isTrending = false;
      },
      {
        title = "Special Interview with Young Singer";
        description = "Emerging singer shared about her journey";
        content = "The singer said music is her soul. She detailed her journey from a small town to big stages.";
        category = "Interview";
        imageUrl = "https://example.com/images/interview2.jpg";
        date = "2024-06-03";
        isFeatured = false;
        isTrending = true;
      },
    ];

    for (i in Nat.range(0, sampleArticles.size())) {
      let sample = sampleArticles[i];
      let article : Article = {
        id = nextId;
        title = sample.title;
        description = sample.description;
        content = sample.content;
        category = sample.category;
        imageUrl = sample.imageUrl;
        date = sample.date;
        isFeatured = sample.isFeatured;
        isTrending = sample.isTrending;
      };
      articles.add(nextId, article);
      nextId += 1;
    };
  };

  // CRUD Operations - admin only
  public shared ({ caller }) func addArticle(
    title : Text,
    description : Text,
    content : Text,
    category : Text,
    imageUrl : Text,
    date : Text,
    isFeatured : Bool,
    isTrending : Bool,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add articles");
    };
    let id = nextId;
    let newArticle : Article = {
      id = id;
      title = title;
      description = description;
      content = content;
      category = category;
      imageUrl = imageUrl;
      date = date;
      isFeatured = isFeatured;
      isTrending = isTrending;
    };
    articles.add(id, newArticle);
    nextId += 1;
    id;
  };

  public shared ({ caller }) func updateArticle(article : Article) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update articles");
    };
    switch (articles.get(article.id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?_) {
        let updatedArticle : Article = {
          id = article.id;
          title = article.title;
          description = article.description;
          content = article.content;
          category = article.category;
          imageUrl = article.imageUrl;
          date = article.date;
          isFeatured = article.isFeatured;
          isTrending = article.isTrending;
        };
        articles.add(article.id, updatedArticle);
      };
    };
  };

  public shared ({ caller }) func deleteArticle(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };
    if (not articles.containsKey(id)) {
      Runtime.trap("Article with id " # id.toText() # " does not exist");
    };
    articles.remove(id);
  };

  // Data fetching - public, no auth required
  public query func getArticles() : async [Article] {
    articles.values().toArray();
  };

  public query func getArticleById(id : Nat) : async ?Article {
    articles.get(id);
  };

  public query func getArticlesByCategory(category : Text) : async [Article] {
    articles.values().toArray().filter(func(article : Article) : Bool {
      article.category == category;
    });
  };
};
