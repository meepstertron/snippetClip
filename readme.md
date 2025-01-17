
<br/>
<div align="center">

<h3 align="center">SnippetClip</h3>
<p align="center">
An code snippet sharing platform

<br/>
<br/>
<a href="https://snippetclip.development.hexagonical.ch">View Demo .</a>  
<a href="https://github.com/Meepstertron/snippetClip/issues/new?labels=bug">Report Bug .</a>
<a href="https://github.com/Meepstertron/snippetClip/issues/new?labels=feature">Request Feature</a>
</p>
</div>

## About The Project

![Banner](https://github.com/meepstertron/snippetClip/blob/main/snippetclip-banner.png?raw=true)

SnippetClip is a snippet-sharing platform I created for Hack Club High Seas. It's a simple yet powerful service designed to transfer code snippets from your browser to your IDE seamlessly.  A feature missing in many other snippet apps.


### Built With

- [Node](https://nodejs.org/)
- [React](https://reactjs.org)
- [Vite](https://vite.dev/)
- [Tailwind](https://tailwindcss.com/)
- [Python](https://www.python.org/)
- [JQuery](https://jquery.com)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Flask](https://flask.palletsprojects.com/)
## Getting Started

Use the public service under https://snippetclip.development.hexagonical.ch

This guide is on how to selfhost the service
### Prerequisites

For running SnippetClip on your local machine or a server you need following pieces of software/tools:

- npm
- Python
- docker compose
- docker registry (optional if you are directly building on the server.)

### Installation

*Below is a example on how you could install snippetclip on your server without a registry this may differ if you have a different setup*


1. Clone the repo
   ```sh
   git clone https://github.com/meepstertron/copytree.git
   ```
2. Install NPM packages
   ```sh
   cd frontend/snippetClip
   npm install
   ```
3. Build using vite
   ```sh
   npm run build
   ```

4. Set sail and Docker up!

*First check if you set all the ports correctly and the admin db password*

```sh
 docker compose -d --build
```

5. Populate DB

Open adminer and  log in using the db admin password you have set

username: `root`

password: `example` (this is the default, NEVER USE THIS IN PRODUCTION)

go to import and drag in the `snippet_clip.sql` file this will populate the db with all the needed tables

6. Check if working

Navigate to `localhost:[your port for frontend]`

Try logging in and check the console this will provide debug info about the api
## Roadmap

- [x] Add Changelog
- [x] Add Upvoting
- [ ] Customisation for user profiles
- [ ] Settings 
- [ ] Email server


See the [open issues](https://github.com/ShaanCoding/ReadME-Generator/issues) for a full list of proposed features (and known issues).
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "feature".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature. with 0 bugs, trust me bro'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
## License

Distributed under the MIT License. See [MIT License](https://opensource.org/licenses/MIT) for more information.
## Contact

Meepstertron - [HackClub Slack](https://hackclub.slack.com/team/U087PR1B2HX) - jan.koch@hexagonical.ch

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)
## Acknowledgments

Cool stuff or people 


- [shadcn UI](https://ui.shadcn.com/)
- [The awesome people at Hackclub](https://hackclub.com/)
