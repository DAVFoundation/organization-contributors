# organization-contributors

A command line tool for extracting the list of contributors across an entire Organization



### Sample

Output will be genereated in this format...

```
[
    {
      "user": "griffobeid",
      "name": "Griffin Obeid",
      "avatar": "https://avatars0.githubusercontent.com/u/12220672?s=460&v=4",
      "bio": "I love coding, extreme sports, and drumming 😄",
      "contrib_count": 43,
      "repos": [{ "name": "missions", "url": "https://github.com/DAVFoundation/missions" }, { "name": "missioncontrol", "url": "https://github.com/DAVFoundation/missioncontrol" }]
    },
    {
      "user": "Peachball",
      "avatar": "https://avatars2.githubusercontent.com/u/8812400?s=460&v=4",
      "contrib_count": 2,
      "repos": [{ "name": "missions", "url": "https://github.com/DAVFoundation/missions" }]
    }
  ]

```

Exclude list should be of this format...

```
{
  "users": ["TalAter", "shekit"],
  "repos": ["missions"]
}
```
