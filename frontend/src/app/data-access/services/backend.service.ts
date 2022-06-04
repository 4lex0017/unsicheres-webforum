import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Thread} from "../models/thread";
import {Access} from "../models/access";
import {of} from 'rxjs';
import {UserFull} from "../models/userFull";
import {Post} from "../models/post";
import {User} from "../models/user";
import {PostReply} from "../models/postReply";
import {VulnerabilityDifficultyOverview} from "../models/vulnerabilityDifficultyOverview";

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  readonly url: string = 'http://localhost:4200';
  idThreadTracker: number = 100;
  idPostTracker: number = 200;
  idUserRegister: number = 500;

  constructor() {
  }

  loadData(): Access {
    return this.accessData;
  }

  getAllUsers(): UserFull[] {
    return [];
  }

  //Get Array for User Profile
  getThreadsFromUser(id: number): Thread[] {
    let result: Thread[] = [];
    for (let i = 0; i < this.accessData.categories.length; i++) {
      for (let z = 0; z < this.accessData.categories[i].threads.length; z++) {
        if (id == this.accessData.categories[i].threads[z].author.id) {
          result.push(this.accessData.categories[i].threads[z]);
        }
      }
    }

    return result;
  }

  getPostsFromUser(id: number): Post[] {
    let result: Post[] = [];
    for (let i = 0; i < this.accessData.categories.length; i++) {
      for (let z = 0; z < this.accessData.categories[i].threads.length; z++) {
        for (let x = 0; x < this.accessData.categories[i].threads[z].posts.length; x++) {
          if (id == this.accessData.categories[i].threads[z].posts[x].author.id) {
            result.push(this.accessData.categories[i].threads[z].posts[x]);
          }
        }
      }
    }
    return result;
  }

  //Get Observables for Profile and Thread component
  getUser(id: number): Observable<UserFull> {

    for (let i = 0; i < this.userData.length; i++) {
      if (id == this.userData[i].id) {
        return of(this.userData[i]);
      }
    }

    return new Observable<UserFull>();
  }

  //Get String of Category from Thread id
  getCategoryStrFromThreadId(id: number): string {

    for (let i = 0; i < this.accessData.categories.length; i++) {
      for (let z = 0; z < this.accessData.categories[i].threads.length; z++) {
        if (id == this.accessData.categories[i].threads[z].id) {
          return this.accessData.categories[i].title;
        }
      }
    }
    return "";
  }

  //Get String of Thread slug from Post id
  getThreadSlugFromPostId(id: number): string {
    for (let i = 0; i < this.accessData.categories.length; i++) {
      for (let z = 0; z < this.accessData.categories[i].threads.length; z++) {
        for (let x = 0; x < this.accessData.categories[i].threads[z].posts.length; x++) {
          if (id == this.accessData.categories[i].threads[z].posts[x].id) {
            return this.getSlugFromTitle(this.accessData.categories[i].threads[z].title);
          }
        }
      }
    }
    return "";
  }

  getThread(slug: string): Observable<Thread> {

    for (let i = 0; i < this.accessData.categories.length; i++) {
      for (let z = 0; z < this.accessData.categories[i].threads.length; z++) {
        if (slug == this.getSlugFromTitle(this.accessData.categories[i].threads[z].title)) {
          return of(this.accessData.categories[i].threads[z]);
        }
      }
    }

    return new Observable<Thread>();
  }

  getSlugFromTitle(title: string) {
    return title.replace(/\s+/g, '-').toLowerCase();
  }

  getFullUserFromUserId(id: number): UserFull {

    for (let i = 0; i < this.userData.length; i++) {
      if (id == this.userData[i].id) {
        return this.userData[i];
      }
    }
    return {
      id: -1,
      username: "dummy",
      joined: "",
      about: "",
      role: [],
      birthDate: "01.01.1990",
      comments: [
        {
          id: -2,
          content: "",
          userId: -1
        }
      ],
    }
  }

  createPostObject(userId: number, content: string, repliedTo?: PostReply): Post {
    if (!repliedTo) {
      repliedTo = {
        repliedToId: -1,
        repliedToContent: ""
      };
    }
    let postObject: Post =
      {
        id: this.idPostTracker,
        content: content,
        repliedTo: repliedTo,
        date: this.formatDate(),
        author: this.getUserFromUsername(userId),
        likedFrom: []
      }
    this.idPostTracker++;
    return postObject;
  }

  createThreadObject(userId: number, title: string): Thread {

    let threadObject: Thread = {
      id: this.idThreadTracker,
      title: title,
      date: this.formatDate(),
      posts: [],
      author: this.getUserFromUsername(userId),
      likedFrom: []
    }
    this.idThreadTracker++;
    return threadObject;
  }


  getUserFromUsername(id: number): User {
    let username = "";
    for (let user of this.loginData.loginData) {
      if (user.id == id) {
        username = user.username;
      }
    }
    return {id: id, username: username};
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(): string {
    let date: Date = new Date();
    return (
      [
        this.padTo2Digits(date.getDate()),
        this.padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('.'));

  }

  getRandomUsers(): UserFull[] {
    let users: UserFull[] = [];
    for (let z = 0; z < 4; z++) {
      users.push(this.userData[Math.floor(Math.random() * 9)]);
      console.log(users)
    }
    return users;
  }

  getRandomPosts(): Post[] {
    return this.getPostsFromUser(12);
  }

  getRandomThreads(): Thread[] {
    return this.getThreadsFromUser(11);
  }

  checkRegisterUserExists(username: string): boolean {
    for (let i = 0; i < this.loginData.loginData.length; i++) {
      if (this.loginData.loginData[i].username == username) {
        return true;
      }
    }
    return false;
  }

  checkLoginData(username: string, password: string): number {
    for (let i = 0; i < this.loginData.loginData.length; i++) {
      if (this.loginData.loginData[i].username == username) {
        if (this.loginData.loginData[i].password == password) {
          return 1;
        } else {
          return 0;
        }
      }
    }
    return -1;
  }

  getLoginId(username: string, password: string): number {
    for (let i = 0; i < this.loginData.loginData.length; i++) {
      if (this.loginData.loginData[i].username == username) {
        if (this.loginData.loginData[i].password == password) {
          return this.loginData.loginData[i].id;
        }
      }
    }
    return -1;
  }

  registerNewUser(userName: string, userPassword: string, date: string): void {
    this.loginData.loginData.push(
      {
        "id": this.idUserRegister,
        "username": userName,
        "password": userPassword
      },
    )
    this.userData.push({
      "id": this.idUserRegister,
      "username": userName,
      "joined": this.formatDate(),
      "birthDate": date,
      "about": "",
      "role": [
        "Member"
      ],
      "comments": []
    })
    this.idUserRegister++;
  }

  getVulnerabilities(): VulnerabilityDifficultyOverview[] {
    return this.vulnerabilitiesOverview.vulnerabilities;
  }

  setVulnerabilities(vulnerabilities: VulnerabilityDifficultyOverview[]): void {
    this.vulnerabilitiesOverview.vulnerabilities = vulnerabilities;
  }

  getVulnerabilitiesObservable(): Observable<VulnerabilityDifficultyOverview[]> {
    return of(this.vulnerabilitiesOverview.vulnerabilities)
  }

  getVulnerability(id: number): VulnerabilityDifficultyOverview | null {
    for (let v of this.vulnerabilitiesOverview.vulnerabilities) {
      if (v.id == id) {
        return v;
      }
    }
    return null;
  }

  getUserPicture(userId: number): string | undefined {
    for (let i = 0; i < this.userData.length; i++) {
      if (userId == this.userData[i].id) {
        if (this.userData[i].image) return this.userData[i].image;
      }
    }
    return undefined;
  }

  accessData =
    {
      "categories": [
        {
          "id": 51,
          "title": "Community",
          "threads": [
            {
              "id": 21,
              "title": "Community Thread 1",
              "content": "Hello, I have a question about Angular.",
              "date": "01.01.0001",
              "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
              "author":
                {
                  "id": 11,
                  "username": "TestUsername1"
                },
              "posts": [
                {
                  "id": 31,
                  "content": "this is a test post",
                  "date": "04.01.0001",
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
                  "author":
                    {
                      "id": 12,
                      "username": "TestUsername2"
                    }
                },
                {
                  "id": 32,
                  "content": "this is a 2nd answer test post",
                  "date": "06.01.0001",
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
                  "author":
                    {
                      "id": 135,
                      "username": "test_test_testuser"
                    }
                }
              ]
            },
            {
              "id": 22,
              "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
              "title": "Community Thread 2",
              "date": "02.01.0001",
              "content": "This is the content of the 2nd community thread.",
              "author":
                {
                  "id": 12,
                  "username": "TestUsername2"
                },
              "posts": [
                {
                  "id": 33,
                  "content": "this is a test post2",
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
                  "date": "07.01.0001",
                  "author":
                    {
                      "id": 13,
                      "username": "TestUsername3"
                    }
                }
              ]
            }
          ]
        },
        {
          "id": 52,
          "title": "General",
          "threads": [
            {
              "id": 25,
              "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
              "title": "General Thread 1",
              "content": "This is the content of the first general thread.",
              "date": "06.01.0001",
              "author":
                {
                  "id": 11,
                  "username": "TestUsername1"
                },
              "posts": [
                {
                  "id": 31,
                  "likedFrom": [11, 1553, 14, 1882, 1444, 1555, 131],
                  "content": "this is a test post",
                  "date": "06.02.0001",
                  "author":
                    {
                      "id": 12,
                      "username": "TestUsername2"
                    }

                }
              ]
            },
            {
              "id": 27,
              "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
              "title": "General Thread 2",
              "content": "This is the content of the 2nd general thread.",
              "date": "14.01.0001",
              "author":
                {
                  "id": 14,
                  "username": "TestUsername4"
                },
              "posts": [
                {
                  "id": 33,
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
                  "content": "this is a test post33",
                  "date": "06.03.0001",
                  "author":
                    {
                      "id": 1553,
                      "username": "TestUsername553"
                    }
                }
              ]
            }
          ]
        },
        {
          "id": 53,
          "title": "Support",
          "threads": [
            {
              "id": 29,
              "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
              "title": "Support Thread 1",
              "content": "This is the content of the first support thread.",
              "date": "12.01.0001",
              "author":
                {
                  "id": 123,
                  "username": "TestUsername123"
                },
              "posts": [
                {
                  "id": 393,
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555],
                  "content": "this is a test post",
                  "date": "06.02.0001",
                  "author":
                    {
                      "id": 12,
                      "username": "TestUsername2"
                    }

                }
              ]
            },
            {
              "id": 27111,
              "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
              "title": "Support Thread 2",
              "content": "This is the content of the thread.",
              "date": "14.01.0001",
              "author":
                {
                  "id": 1882,
                  "username": "TestUsername882"
                },
              "posts": [
                {
                  "id": 337,
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
                  "content": "this is a test post33",
                  "date": "06.03.0001",
                  "author":
                    {
                      "id": 1553,
                      "username": "TestUsername553"
                    }
                }
              ]
            },
            {
              "id": 21235,
              "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
              "title": "support Thread 3",
              "content": "This is the content of the thread.",
              "date": "06.01.0001",
              "author":
                {
                  "id": 131,
                  "username": "TestUsername131"
                },
              "posts": [
                {
                  "id": 3981,
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
                  "content": "this is a test post",
                  "date": "06.02.0001",
                  "author":
                    {
                      "id": 12,
                      "username": "TestUsername2"
                    }

                }
              ]
            },
            {
              "id": 28677,
              "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
              "title": "Support Thread 4",
              "content": "This is the content of the thread.",
              "date": "14.01.0001",
              "author":
                {
                  "id": 1444,
                  "username": "TestUsername444"
                },
              "posts": [
                {
                  "id": 3855363,
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
                  "content": "this is a test post33",
                  "date": "06.03.0001",
                  "author":
                    {
                      "id": 1553,
                      "username": "TestUsername553"
                    }
                }
              ]
            },
            {
              "id": 267459,
              "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
              "title": "Support Thread 5",
              "content": "This is the content of the thread.",
              "date": "06.01.0001",
              "author":
                {
                  "id": 11,
                  "username": "TestUsername1"
                },
              "posts": [
                {
                  "id": 3098751,
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
                  "content": "this is a test post",
                  "date": "06.02.0001",
                  "author":
                    {
                      "id": 12,
                      "username": "TestUsername2"
                    }

                }
              ]
            },
            {
              "id": 296417,
              "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
              "title": "Support Thread 6",
              "content": "This is the content of the 2nd general thread.",
              "date": "35.01.0001",
              "author":
                {
                  "id": 14,
                  "username": "TestUsername4"
                },
              "posts": [
                {
                  "id": 3836453,
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
                  "content": "this is a test post3asfdga3",
                  "date": "06.03.0001",
                  "author":
                    {
                      "id": 1553,
                      "username": "TestUsername553"
                    }
                },
                {
                  "id": 3387644,
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
                  "content": "this is a test post33adf",
                  "date": "06.03.0001",
                  "author":
                    {
                      "id": 1553,
                      "username": "TestUsername553"
                    }
                },
                {
                  "id": 30394673,
                  "likedFrom": [11, 12, 135, 1553, 14, 1882, 1444, 1555, 131],
                  "content": "this is a test post3db3",
                  "date": "06.03.0001",
                  "author":
                    {
                      "id": 1553,
                      "username": "TestUsername553"
                    }
                }
              ]
            }


          ]
        }
      ]
    };

  userData: UserFull[] =
    [
      {
        "id": 11,
        "username": "TestUsername1",
        "birthDate": "01.01.1990",
        "joined": "12.01.0003",
        "about": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "role": [
          "Member",
          "Admin"
        ],
        "comments": [
          {
            "id": 1,
            "content": "Nice profile!",
            "userId": 12
          },
          {
            "id": 2,
            "content": "Nice profile test 123!",
            "userId": 135
          }
        ]
      },
      {
        "id": 12,
        "username": "TestUsername2",
        "birthDate": "01.01.1990",
        "joined": "15.02.0003",
        "about": " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean porttitor lobortis magna, mollis maximus nulla. Etiam sit amet feugiat lacus. Aenean ligula urna, malesuada eget libero accumsan, aliquet volutpat massa. Sed leo metus, convallis vel tincidunt sed, dapibus sed lacus. Cras euismod ligula vel ex maximus venenatis. Praesent maximus nisl eget leo finibus aliquam. Nunc vehicula libero sodales, condimentum diam in, placerat neque. Integer pretium eros a lacinia lobortis. Phasellus faucibus sem leo, nec venenatis purus venenatis vitae. Nulla semper massa ut dolor blandit sagittis. ",
        "role": ["User", "Experienced"],
        "comments": [
          {
            "id": 3,
            "content": "Nice profile!",
            "userId": 11
          },
          {
            "id": 4,
            "content": "Nice profile test 123!",
            "userId": 135
          }
        ]
      },
      {
        "id": 135,
        "username": "test_test_testuser",
        "birthDate": "01.01.1990",
        "joined": "15.02.0003",
        "about": " Maecenas sed nibh sodales, egestas ex ac, ultricies tortor. Sed vitae odio pellentesque sapien pellentesque pellentesque. Mauris ac iaculis felis. Phasellus sed accumsan mauris. Quisque leo mi, luctus sed nulla non, luctus porttitor nunc. Pellentesque sit amet justo quis eros tempus scelerisque. Donec lacinia ut elit non lacinia. Ut ut purus et lectus euismod aliquet. Suspendisse interdum risus nec augue ornare laoreet. Sed pretium odio a nisl aliquet ultricies pulvinar vitae est. Pellentesque lacinia et sem egestas eleifend. Vivamus et tincidunt tortor, sit amet pretium libero. Pellentesque molestie turpis semper eros scelerisque, non sagittis justo ornare. Sed at porttitor diam, sed suscipit nulla. ",
        "role": ["User",],
        "comments": [
          {
            "id": 5,
            "content": "Nice profile!",
            "userId": 12
          },
          {
            "id": 6,
            "content": "Nice profile test 123!",
            "userId": 135
          }
        ]
      },
      {
        "id": 1553,
        "username": "TestUsername553",
        "birthDate": "01.01.1990",
        "joined": "15.02.0003",
        "about": " Donec ac gravida tellus. Donec sollicitudin est in lectus ullamcorper, vitae finibus ex bibendum. Suspendisse lacus erat, hendrerit in dolor viverra, efficitur tincidunt nibh. Etiam a tincidunt lacus, vitae sagittis tellus. Maecenas hendrerit et tortor in euismod. Cras varius ex id lacinia feugiat. Aenean tincidunt odio lorem, ac congue odio convallis nec. Mauris sit amet est euismod, euismod sem ac, imperdiet lacus. Fusce venenatis nisl vel porta ultricies. Praesent sodales sollicitudin nisl, tristique porta eros sagittis sit amet. Curabitur et erat nec dolor vulputate facilisis ac ac leo. Vestibulum a suscipit velit. Fusce imperdiet ac arcu eu faucibus. In molestie mauris a erat sodales eleifend. Nullam ac dui vitae risus egestas pharetra. ",
        "role": ["User", "Tester"],
        "comments": [
          {
            "id": 7,
            "content": "Nice profile!",
            "userId": 12
          },
          {
            "id": 8,
            "content": "Nice profile test 123!",
            "userId": 135
          }
        ]
      },
      {
        "id": 14,
        "username": "TestUsername4",
        "birthDate": "01.01.1990",
        "joined": "15.02.0003",
        "about": " Donec ac gravida tellus. Donec sollicitudin est in lectus ullamcorper, vitae finibus ex bibendum. Suspendisse lacus erat, hendrerit in dolor viverra, efficitur tincidunt nibh. Etiam a tincidunt lacus, vitae sagittis tellus. Maecenas hendrerit et tortor in euismod. Cras varius ex id lacinia feugiat. Aenean tincidunt odio lorem, ac congue odio convallis nec. Mauris sit amet est euismod, euismod sem ac, imperdiet lacus. Fusce venenatis nisl vel porta ultricies. Praesent sodales sollicitudin nisl, tristique porta eros sagittis sit amet. Curabitur et erat nec dolor vulputate facilisis ac ac leo. Vestibulum a suscipit velit. Fusce imperdiet ac arcu eu faucibus. In molestie mauris a erat sodales eleifend. Nullam ac dui vitae risus egestas pharetra. ",
        "role": ["User", "Developer"],
        "comments": [
          {
            "id": 9,
            "content": "Nice profile!",
            "userId": 12
          },
          {
            "id": 10,
            "content": "Nice profile test 123!",
            "userId": 135
          }
        ]
      },
      {
        "id": 123,
        "username": "TestUsername123",
        "birthDate": "01.01.1990",
        "joined": "15.02.0003",
        "about": "",
        "role": ["User", "Admin"],
        "comments": [
          {
            "id": 11,
            "content": "Nice profile!",
            "userId": 12
          },
          {
            "id": 12,
            "content": "Nice profile test 123!",
            "userId": 135
          }
        ]
      },
      {
        "id": 1882,
        "username": "TestUsername882",
        "birthDate": "01.01.1990",
        "joined": "15.02.0003",
        "about": " Fusce semper id mi at feugiat. Cras in consequat metus, eu pulvinar leo. Morbi elementum eget nibh nec bibendum. Integer porttitor tincidunt posuere. Curabitur id vestibulum dolor. Aliquam id orci gravida, auctor nunc sed, consequat nisi. Vestibulum venenatis suscipit nibh, id viverra orci placerat quis. Pellentesque dapibus massa in neque varius lacinia. Quisque hendrerit metus vitae massa hendrerit porttitor. Donec luctus ornare lacus, non venenatis lectus rutrum hendrerit. Aenean imperdiet at nisi non dictum. Nam id turpis id erat cursus luctus sit amet id metus. Integer ut posuere nibh, sed varius ipsum. Cras a ipsum in nisi facilisis congue. Nam pulvinar arcu vel nunc sodales, in egestas magna finibus. Vivamus venenatis, dolor non rhoncus consectetur, lorem sem laoreet libero, ac tristique nisl arcu vitae nisl. ",
        "role": ["User", "Tester"],
        "comments": [
          {
            "id": 13,
            "content": "Nice profile!",
            "userId": 12
          },
          {
            "id": 14,
            "content": "Nice profile test 123!",
            "userId": 135
          }
        ]
      },
      {
        "id": 1444,
        "username": "TestUsername444",
        "birthDate": "01.01.1990",
        "joined": "15.02.0003",
        "about": " Fusce semper id mi at feugiat. Cras in consequat metus, eu pulvinar leo. Morbi elementum eget nibh nec bibendum. Integer porttitor tincidunt posuere. Curabitur id vestibulum dolor. Aliquam id orci gravida, auctor nunc sed, consequat nisi. Vestibulum venenatis suscipit nibh, id viverra orci placerat quis. Pellentesque dapibus massa in neque varius lacinia. Quisque hendrerit metus vitae massa hendrerit porttitor. Donec luctus ornare lacus, non venenatis lectus rutrum hendrerit. Aenean imperdiet at nisi non dictum. Nam id turpis id erat cursus luctus sit amet id metus. Integer ut posuere nibh, sed varius ipsum. Cras a ipsum in nisi facilisis congue. Nam pulvinar arcu vel nunc sodales, in egestas magna finibus. Vivamus venenatis, dolor non rhoncus consectetur, lorem sem laoreet libero, ac tristique nisl arcu vitae nisl. ",
        "role": ["Customer", "Member"],
        "comments": [
          {
            "id": 15,
            "content": "Nice profile!",
            "userId": 12
          },
          {
            "id": 16,
            "content": "Nice profile test 123!",
            "userId": 135
          }
        ]
      },
      {
        "id": 1555,
        "username": "TestUsername555",
        "birthDate": "01.01.1990",
        "joined": "15.02.0003",
        "about": "Donec ac gravida tellus. Donec sollicitudin est in lectus ullamcorper, vitae finibus ex bibendum. Suspendisse lacus erat, hendrerit in dolor viverra, efficitur tincidunt nibh. Etiam a tincidunt lacus, vitae sagittis tellus.",
        "role": ["Member", "Angular Expert"],
        "comments": [
          {
            "id": 17,
            "content": "Nice profile!",
            "userId": 12
          },
          {
            "id": 18,
            "content": "Nice profile test 123!",
            "userId": 135
          }
        ]
      },
      {
        "id": 131,
        "username": "TestUsername131",
        "birthDate": "01.01.1990",
        "joined": "15.02.0003",
        "about": "Donec ac gravida tellus. Donec sollicitudin est in lectus ullamcorper, vitae finibus ex bibendum. Suspendisse lacus erat, hendrerit in dolor viverra, efficitur tincidunt nibh. Etiam a tincidunt lacus, vitae sagittis tellus.",
        "role": ["User", "Member"],
        "comments": [
          {
            "id": 19,
            "content": "Nice profile!",
            "userId": 12
          },
          {
            "id": 20,
            "content": "Nice profile test 123!",
            "userId": 135
          }
        ]
      },
    ];
  userDataOld =
    {
      "UserFull": [
        {
          "id": 11,
          "username": "TestUsername1",
          "joined": "12.01.0003",
          "about": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          "role": [
            "Member",
            "Admin"
          ],
          "comments": [
            {
              "id": 1,
              "content": "Nice profile!",
              "userId": 2
            },
            {
              "id": 2,
              "content": "Nice profile test 123!",
              "userId": 135
            }
          ]
        },
        {
          "id": 12,
          "username": "TestUsername2",
          "joined": "15.02.0003",
          "about": " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean porttitor lobortis magna, mollis maximus nulla. Etiam sit amet feugiat lacus. Aenean ligula urna, malesuada eget libero accumsan, aliquet volutpat massa. Sed leo metus, convallis vel tincidunt sed, dapibus sed lacus. Cras euismod ligula vel ex maximus venenatis. Praesent maximus nisl eget leo finibus aliquam. Nunc vehicula libero sodales, condimentum diam in, placerat neque. Integer pretium eros a lacinia lobortis. Phasellus faucibus sem leo, nec venenatis purus venenatis vitae. Nulla semper massa ut dolor blandit sagittis. ",
          "role": ["User", "Experienced"],
          "comments": [
            {
              "id": 3,
              "content": "Nice profile!",
              "userId": 1
            },
            {
              "id": 4,
              "content": "Nice profile test 123!",
              "userId": 135
            }
          ]
        },
        {
          "id": 135,
          "username": "test_test_testuser",
          "joined": "15.02.0003",
          "about": " Maecenas sed nibh sodales, egestas ex ac, ultricies tortor. Sed vitae odio pellentesque sapien pellentesque pellentesque. Mauris ac iaculis felis. Phasellus sed accumsan mauris. Quisque leo mi, luctus sed nulla non, luctus porttitor nunc. Pellentesque sit amet justo quis eros tempus scelerisque. Donec lacinia ut elit non lacinia. Ut ut purus et lectus euismod aliquet. Suspendisse interdum risus nec augue ornare laoreet. Sed pretium odio a nisl aliquet ultricies pulvinar vitae est. Pellentesque lacinia et sem egestas eleifend. Vivamus et tincidunt tortor, sit amet pretium libero. Pellentesque molestie turpis semper eros scelerisque, non sagittis justo ornare. Sed at porttitor diam, sed suscipit nulla. ",
          "role": ["User",],
          "comments": [
            {
              "id": 5,
              "content": "Nice profile!",
              "userId": 2
            },
            {
              "id": 6,
              "content": "Nice profile test 123!",
              "userId": 135
            }
          ]
        },
        {
          "id": 1553,
          "username": "TestUsername553",
          "joined": "15.02.0003",
          "about": " Donec ac gravida tellus. Donec sollicitudin est in lectus ullamcorper, vitae finibus ex bibendum. Suspendisse lacus erat, hendrerit in dolor viverra, efficitur tincidunt nibh. Etiam a tincidunt lacus, vitae sagittis tellus. Maecenas hendrerit et tortor in euismod. Cras varius ex id lacinia feugiat. Aenean tincidunt odio lorem, ac congue odio convallis nec. Mauris sit amet est euismod, euismod sem ac, imperdiet lacus. Fusce venenatis nisl vel porta ultricies. Praesent sodales sollicitudin nisl, tristique porta eros sagittis sit amet. Curabitur et erat nec dolor vulputate facilisis ac ac leo. Vestibulum a suscipit velit. Fusce imperdiet ac arcu eu faucibus. In molestie mauris a erat sodales eleifend. Nullam ac dui vitae risus egestas pharetra. ",
          "role": ["User", "Tester"],
          "comments": [
            {
              "id": 7,
              "content": "Nice profile!",
              "userId": 2
            },
            {
              "id": 8,
              "content": "Nice profile test 123!",
              "userId": 135
            }
          ]
        },
        {
          "id": 14,
          "username": "TestUsername4",
          "joined": "15.02.0003",
          "about": " Donec ac gravida tellus. Donec sollicitudin est in lectus ullamcorper, vitae finibus ex bibendum. Suspendisse lacus erat, hendrerit in dolor viverra, efficitur tincidunt nibh. Etiam a tincidunt lacus, vitae sagittis tellus. Maecenas hendrerit et tortor in euismod. Cras varius ex id lacinia feugiat. Aenean tincidunt odio lorem, ac congue odio convallis nec. Mauris sit amet est euismod, euismod sem ac, imperdiet lacus. Fusce venenatis nisl vel porta ultricies. Praesent sodales sollicitudin nisl, tristique porta eros sagittis sit amet. Curabitur et erat nec dolor vulputate facilisis ac ac leo. Vestibulum a suscipit velit. Fusce imperdiet ac arcu eu faucibus. In molestie mauris a erat sodales eleifend. Nullam ac dui vitae risus egestas pharetra. ",
          "role": ["User", "Developer"],
          "comments": [
            {
              "id": 9,
              "content": "Nice profile!",
              "userId": 2
            },
            {
              "id": 10,
              "content": "Nice profile test 123!",
              "userId": 135
            }
          ]
        },
        {
          "id": 123,
          "username": "TestUsername123",
          "joined": "15.02.0003",
          "about": "",
          "role": ["User", "Admin"],
          "comments": [
            {
              "id": 11,
              "content": "Nice profile!",
              "userId": 2
            },
            {
              "id": 12,
              "content": "Nice profile test 123!",
              "userId": 135
            }
          ]
        },
        {
          "id": 1882,
          "username": "TestUsername882",
          "joined": "15.02.0003",
          "about": " Fusce semper id mi at feugiat. Cras in consequat metus, eu pulvinar leo. Morbi elementum eget nibh nec bibendum. Integer porttitor tincidunt posuere. Curabitur id vestibulum dolor. Aliquam id orci gravida, auctor nunc sed, consequat nisi. Vestibulum venenatis suscipit nibh, id viverra orci placerat quis. Pellentesque dapibus massa in neque varius lacinia. Quisque hendrerit metus vitae massa hendrerit porttitor. Donec luctus ornare lacus, non venenatis lectus rutrum hendrerit. Aenean imperdiet at nisi non dictum. Nam id turpis id erat cursus luctus sit amet id metus. Integer ut posuere nibh, sed varius ipsum. Cras a ipsum in nisi facilisis congue. Nam pulvinar arcu vel nunc sodales, in egestas magna finibus. Vivamus venenatis, dolor non rhoncus consectetur, lorem sem laoreet libero, ac tristique nisl arcu vitae nisl. ",
          "role": ["User", "Tester"],
          "comments": [
            {
              "id": 13,
              "content": "Nice profile!",
              "userId": 2
            },
            {
              "id": 14,
              "content": "Nice profile test 123!",
              "userId": 135
            }
          ]
        },
        {
          "id": 1444,
          "username": "TestUsername444",
          "joined": "15.02.0003",
          "about": " Fusce semper id mi at feugiat. Cras in consequat metus, eu pulvinar leo. Morbi elementum eget nibh nec bibendum. Integer porttitor tincidunt posuere. Curabitur id vestibulum dolor. Aliquam id orci gravida, auctor nunc sed, consequat nisi. Vestibulum venenatis suscipit nibh, id viverra orci placerat quis. Pellentesque dapibus massa in neque varius lacinia. Quisque hendrerit metus vitae massa hendrerit porttitor. Donec luctus ornare lacus, non venenatis lectus rutrum hendrerit. Aenean imperdiet at nisi non dictum. Nam id turpis id erat cursus luctus sit amet id metus. Integer ut posuere nibh, sed varius ipsum. Cras a ipsum in nisi facilisis congue. Nam pulvinar arcu vel nunc sodales, in egestas magna finibus. Vivamus venenatis, dolor non rhoncus consectetur, lorem sem laoreet libero, ac tristique nisl arcu vitae nisl. ",
          "role": ["Customer", "Member"],
          "comments": [
            {
              "id": 15,
              "content": "Nice profile!",
              "userId": 2
            },
            {
              "id": 16,
              "content": "Nice profile test 123!",
              "userId": 135
            }
          ]
        },
        {
          "id": 1555,
          "username": "TestUsername555",
          "joined": "15.02.0003",
          "about": "Donec ac gravida tellus. Donec sollicitudin est in lectus ullamcorper, vitae finibus ex bibendum. Suspendisse lacus erat, hendrerit in dolor viverra, efficitur tincidunt nibh. Etiam a tincidunt lacus, vitae sagittis tellus.",
          "role": ["Member", "Angular Expert"],
          "comments": [
            {
              "id": 17,
              "content": "Nice profile!",
              "userId": 2
            },
            {
              "id": 18,
              "content": "Nice profile test 123!",
              "userId": 135
            }
          ]
        },
        {
          "id": 131,
          "username": "TestUsername131",
          "joined": "15.02.0003",
          "about": "Donec ac gravida tellus. Donec sollicitudin est in lectus ullamcorper, vitae finibus ex bibendum. Suspendisse lacus erat, hendrerit in dolor viverra, efficitur tincidunt nibh. Etiam a tincidunt lacus, vitae sagittis tellus.",
          "role": ["User", "Member"],
          "comments": [
            {
              "id": 19,
              "content": "Nice profile!",
              "userId": 2
            },
            {
              "id": 20,
              "content": "Nice profile test 123!",
              "userId": 135
            }
          ]
        },

      ]
    };

  loginData =
    {
      "loginData": [
        {
          "id": 11,
          "username": "TestUsername1",
          "password": "123"
        },
        {
          "id": 12,
          "username": "TestUsername2",
          "password": "123"
        },
        {
          "id": 135,
          "username": "test_test_testuser",
          "password": "789"
        },
        {
          "id": 1553,
          "username": "TestUsername553",
          "password": "789"
        },
        {
          "id": 14,
          "username": "TestUsername4",
          "password": "789"
        },
        {
          "id": 123,
          "username": "TestUsername123",
          "password": "789"
        },
        {
          "id": 1882,
          "username": "TestUsername882",
          "password": "789"
        },
        {
          "id": 1444,
          "username": "TestUsername444",
          "password": "789"
        },
        {
          "id": 1555,
          "username": "TestUsername555",
          "password": "789"
        },
        {
          "id": 131,
          "username": "TestUsername131",
          "password": "789"
        },
      ]
    };

  contactForms =
    {
      "Forms": [
        {
          "id": 1,
          "email": "user1@test.de",
          "topic": "Community",
          "message": "problem123"
        },
        {
          "id": 2,
          "email": "user2@test.de",
          "topic": "Support",
          "message": "test12334scfv"
        }
      ]
    }

  vulnerabilitiesOverview = {
    "vulnerabilities":
      [
        {
          "id": 1,
          "name": 'Insecure Password Handling',
          "description": 'Passwords are not stored as salted hashes, older algorithms are used.',
          "subtasks": [
            {"id": 1, "state": 'Easy', "description": 'Oldest algorithm.', "checked": false},
            {"id": 2, "state": 'Medium', "description": 'Medium algorithm.', "checked": false},
            {"id": 3, "state": 'Hard', "description": 'Hard algorithm.', "checked": false},
          ],
        },
        {
          "id": 2,
          "name": 'Broken Authentication',
          "description": 'Short/Blank passwords allowed. Brute force attacks are allowed. Easy login with User Enumeration possibility.',
          "subtasks": [
            {"id": 1, "state": 'Easy', "description": 'User enumeration, very easy passwords.', "checked": false},
            {"id": 2, "state": 'Medium', "description": 'User enumeration, medium passwords.', "checked": false},
            {"id": 3, "state": 'Hard', "description": 'Hard passwords.', "checked": false},
          ],
        },
        {
          "id": 3,
          "name": 'SQL Injection',
          "description": 'Allows the User to execute SQL Queries. Difficulty changes filtering for SQL Queries.',
          "subtasks": [
            {"id": 1, "state": 'Easy', "description": 'No filtering.', "checked": false},
            {"id": 2, "state": 'Medium', "description": 'Easy filtering with String.matches().', "checked": false,},
            {"id": 3, "state": 'Hard', "description": 'Hard filtering.', "checked": false},
          ],
        },
        {
          "id": 4,
          "name": 'Command Injection',
          "description": 'Allows the User to execute commands on the host OS.',
          "subtasks": [
            {"id": 1, "state": 'Easy', "description": 'No filtering.', "checked": false},
            {"id": 2, "state": 'Medium', "description": 'Easy filtering with String.matches().', "checked": false},
            {"id": 3, "state": 'Hard', "description": 'Hard filtering.', "checked": false},
          ],
        },
        {
          "id": 5,
          "name": 'File Upload',
          "description": '',
          "subtasks": [
            {"id": 1, "state": 'Easy', "description": 'Accept every Filetype.', "checked": false},
            {"id": 2, "state": 'Medium', "description": 'Accept some Filetypes.', "checked": false},
            {"id": 3, "state": 'Hard', "description": 'Accept selective Filetypes.', "checked": false},
          ],
        },
        {
          "id": 6,
          "name": 'XSS Reflected',
          "description": 'Allows the User to execute <script> and other tags on the site / in queries. Difficulty changes filtering for SQL Queries.',
          "subtasks": [
            {"id": 1, "state": 'Easy', "description": 'No filtering.', "checked": false},
            {"id": 2, "state": 'Medium', "description": 'Easy filtering with String.matches().', "checked": false},
            {"id": 3, "state": 'Hard', "description": 'Hard filtering.', "checked": false},
          ],
        },
        {
          "id": 7,
          "name": 'XSS Stored',
          "description": 'Allows the User to save <script> and other tags on the site. Difficulty changes filtering for SQL Queries.',
          "subtasks": [
            {"id": 1, "state": 'Easy', "description": 'No filtering.', "checked": false},
            {"id": 2, "state": 'Medium', "description": 'Easy filtering with String.matches().', "checked": false},
            {"id": 3, "state": 'Hard', "description": 'Hard filtering.', "checked": false},
          ],
        },
        {
          "id": 8,
          "name": 'Misc',
          "description": 'Miscellaneous features, including tips and help.',
          "subtasks": [
            {
              "id": 1,
              "state": 'Tips',
              "description": 'Adds posts and threads, depending on current vulnerability config, with tips about the vulnerabilities.',
              "checked": false
            },
          ],
        }
      ]
  };

}
