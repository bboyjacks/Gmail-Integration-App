window.onload = () => {
  initListeners();
};

const initListeners = () => {
  let observable = new Observable();

  let navToggleObserver = new NavToggleObserver();
  observable.addObservers(navToggleObserver);

  let mailToggleObserver = new MailToggleObserver();
  observable.addObservers(mailToggleObserver);

  let app = document.querySelector(".app");
  app.addEventListener("click", event => {
    observable.notifyObservers(event);
  });
};

class Observable {
  constructor() {
    this.observers = [];
    this.notifyObservers = this.notifyObservers.bind(this);
    this.addObservers = this.addObservers.bind(this);
  }

  addObservers(o) {
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

const untoggleAllMenuItems = () => {
  let navButtons = document.querySelectorAll(".nav-menu-item");
  navButtons.forEach(navButton => {
    navButton.classList.remove("nav-toggled");
  });
};

/*
	This class listens for updates on the nav menu items
	and ensures the other items are not toggled.
*/
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

class MailToggleObserver extends Observer {
  constructor() {
    super();
  }

  update() {
    let mailNavButton = document.querySelector(
      ".nav-menu-items li:nth-child(2)"
    );
    let mailPopUp = document.querySelector(".mail-popup");

    if (mailNavButton.classList.contains("nav-toggled")) {
      mailPopUp.classList.add("mail-toggled");
    } else {
      mailPopUp.classList.remove("mail-toggled");
    }
  }
}
