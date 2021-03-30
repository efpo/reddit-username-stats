#  Reddit Username Stats

This is a simple backend app that serves data about a reddit user. Currently only fetches comment data.

The app uses AWS amplify to create a serverless (AWS lambda) express app, which connects to the reddit api to fetch data.

Example usage:

`<your-amplify-url-here>/stats?username=GovSchwarzenegger`

returns JSON output:

```
{
  "total_comments": 997,
  "most_commented_subreddit": {
    "u_GovSchwarzenegger": 275
  },
  "comments_per_subreddit": {
    "u_GovSchwarzenegger": 275,
    "europe": 3,
    "interestingasfuck": 1,
    "GetMotivated": 10,
    "nextfuckinglevel": 17,
    "bodybuilding": 73,
    "memes": 10,
    "CovIdiots": 1,
    "Coronavirus": 16,
    "daddit": 3,
    "marvelmemes": 3,
    "politics": 34,
    "movies": 173,
    "progresspics": 1,
    "pics": 25,
    "wholesomememes": 5,
    "MadeMeSmile": 7,
    "findfashion": 1,
    "videos": 66,
    "todayilearned": 12,
    "Minecraft": 1,
    "television": 3,
    "aww": 13,
    "MasterReturns": 3,
    "ColumbusGA": 2,
    "Georgia": 2,
    "blunderyears": 1,
    "assholedesign": 1,
    "The_Mueller": 1,
    "WhitePeopleTwitter": 2,
    "quityourbullshit": 1,
    "woodworking": 3,
    "Damnthatsinteresting": 5,
    "nfl": 2,
    "perfectlycutscreams": 3,
    "funny": 16,
    "HumansBeingBros": 11,
    "blessedcomments": 1,
    "GymMemes": 1,
    "MovieDetails": 1,
    "Art": 2,
    "IAmA": 93,
    "teenagers": 1,
    "environment": 3,
    "sketches": 1,
    "nba": 2,
    "WTF": 2,
    "AskReddit": 6,
    "Strongman": 5,
    "BeAmazed": 4,
    "IsItBullshit": 2,
    "whowouldwin": 1,
    "Texans": 2,
    "sadcringe": 1,
    "worldnews": 3,
    "loseit": 3,
    "OldSchoolCool": 5,
    "therewasanattempt": 1,
    "Fitness": 36,
    "SantaMonica": 1,
    "EverythingScience": 1,
    "Futurology": 1,
    "MURICA": 1,
    "bayarea": 2,
    "LosAngeles": 1,
    "bestof": 3,
    "KasichForPresident": 1,
    "gifs": 1,
    "gainit": 2,
    "ArnoldSchwarzenegger": 1
  },
  "highest_karma": {
    "score": 49713,
    "link": "https://www.reddit.com/r/todayilearned/comments/6vpvoe/til_during_the_filming_of_matilda_danny_devito/",
    "text": "What an incredible story. Thank you for sharing. You're right - Danny is a good man (one of the best), and I know he will love to hear that some of his advice helped you become a great man, although I can tell you always had it in you. I'm going to send this to him so he can see it."
  }
}
```