/*
  Author: Lester Dela Cruz
  Description: This application is the javascript for a
  gmail integration application

  Table of Contents:
  1. Gmail Listener: Listens for changes in Gmail and updates the
  dom
  2. Gmail API: Gmail API related code
  3. Functions
    1. initListeners: Initializes listeners for the app
    2. untoggleAllMenuItems: Simply untoggles the menu items
  
  4. Classes
    1. Observable: Based on Observer Pattern. This notifies 
    all observers.
    2. Observer: Based on Observer Pattern. This is the templated
    observer that gets extended
    3. NavToggleObserver: Extends Observer which listens for changes
    in click events and updates navigation bar accordingly
    4. MailToggleObserver: Extends Observer which listens for changes
    in navigation bar and updates the mail pop up accordingly
*/
window.onload = () => {
  initListeners();
  initGmailListeners();
  loadGmailClient();
};

/*
  Gmail Listener
*/

let gmailObservable;

const initGmailListeners = () => {
  gmailObservable = new GmailObservable();
  let gmailSigninObserver = new GmailSigninObserver();
  gmailObservable.addObserver(gmailSigninObserver);
};

class GmailObservable {
  constructor() {
    this.observers = [];
    this.addObserver = this.addObserver.bind(this);
    this.notifyObservers = this.notifyObservers.bind(this);
  }

  addObserver(o) {
    this.observers.push(o);
  }

  notifyObservers(event) {
    this.observers.forEach(observer => {
      observer.update(event);
    });
  }
}

class GmailObserver {
  constructor() {
    this.update = this.update.bind(this);
  }

  update() {}
}

class GmailSigninObserver extends GmailObserver {
  constructor() {
    super();
  }

  update(event) {
    if (event.signedIn) {
      console.log("User is signed in!");
    } else {
      console.log("User is logged out!");
    }
  }
}

/*
  Gmail API
*/

const CLIENTID =
  "273261561334-lbjnik8ror4g353tpqpls8kc525nqnip.apps.googleusercontent.com";
const APIKEY = "AIzaSyBI5f-5WXxRvdEDi-NIrLS3I7qDnp7Y2lw";
const DISCOVERYDOCS = [
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
];
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

const loadGmailClient = () => {
  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        apiKey: APIKEY,
        clientId: CLIENTID,
        discoveryDocs: DISCOVERYDOCS,
        scope: SCOPES
      })
      .then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      })
      .catch(err => {
        console.log(err);
      });
  });
};

const updateSigninStatus = isSignedIn => {
  gmailObservable.notifyObservers({ signedIn: isSignedIn });
};

const gmailSignIn = () => {
  gapi.auth2.getAuthInstance().signIn();
};

/*
  Functions
*/
const initListeners = () => {
  let appObservable = new Observable();
  let navToggleObserver = new NavToggleObserver();
  appObservable.addObserver(navToggleObserver);

  let mailClickedObserver = new MailClickedObserver();
  appObservable.addObserver(mailClickedObserver);

  let app = document.querySelector(".app");
  app.addEventListener("click", event => {
    appObservable.notifyObservers(event);
  });
};

const untoggleAllMenuItems = () => {
  let navButtons = document.querySelectorAll(".nav-menu-item");
  navButtons.forEach(navButton => {
    navButton.classList.remove("nav-toggled");
  });
};

/*
  Classes
 */

class Observable {
  constructor() {
    this.observers = [];
    this.notifyObservers = this.notifyObservers.bind(this);
    this.addObserver = this.addObserver.bind(this);
  }

  addObserver(o) {
    this.observers.push(o);
  }

  notifyObservers(event) {
    this.observers.forEach(observer => {
      observer.update(event);
    });
  }
}

class Observer {
  constructor() {
    this.update = this.update.bind(this);
  }

  update() {}
}

class NavToggleObserver extends Observer {
  constructor() {
    super();
  }
  update(event) {
    if (event.target.classList.contains("nav-menu-item")) {
      if (event.target.classList.contains("nav-toggled"))
        event.target.classList.remove("nav-toggled");
      else {
        untoggleAllMenuItems();
        event.target.classList.add("nav-toggled");
      }
    } else {
      untoggleAllMenuItems();
    }
  }
}

class MailClickedObserver extends Observer {
  constructor() {
    super();
  }

  update(event) {
    if (event.target.getAttribute("id") === "mail") {
    }
  }
}
