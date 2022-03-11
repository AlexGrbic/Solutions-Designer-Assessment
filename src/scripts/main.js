let storage;
const questDataObject = [
  {
    category: "Development",
    pictureSrc: "src/images/development_icon.png",
    subQuests: [
      {
        name: "Sub-Quest 1",
        info:
          "This is the first task of the TIC Quest. It is a simple task that will be completed by the user.",
        tasks: [
          { name: "task 1", taskId: "1" },
          { name: "task 2", taskId: "2" }
        ]
      }
    ]
  }
];
// define a dictionary that will fill with the completed tasks
let tasksCompleted = [];
window.onDocumentLoad = onDocumentLoad();
function onDocumentLoad() {
  storage = window.localStorage;
  updateSavedData();
  updateElementsFromData();
}

//function that updates tasksCompleted dictionary on document load
function updateSavedData() {
  if (storage.getItem("tasksCompleted")) {
    tasksCompleted = storage.getItem("tasksCompleted").split(",");
  } else {
    storage.setItem("tasksCompleted", tasksCompleted);
  }
}

//function that defines what happens when the checkbox is ticked
function setCheckBoxCompletionStatus(taskId) {
  //if the array containing completed tasks includes current taskID
  if (tasksCompleted.includes(taskId)) {
    const updatedArray = tasksCompleted.filter((id) => {
      return id !== taskId;
    });
    //add completed task to the array then log the array to console
    tasksCompleted = updatedArray;
    console.log(updatedArray);
    //otherwise append taskId to the tasksCompleted array
  } else {
    tasksCompleted.push(taskId);
  }
  storage.setItem("tasksCompleted", tasksCompleted);
}

function determineTaskIsComplete(taskId) {
  return tasksCompleted.includes(taskId);
}

function updateElementsFromData() {
  generateElements();
}

function generateElements() {
  questDataObject.forEach((quest) => {
    const categoryContainer = generateTeamContainerElements(quest);
    generateSubQuestElements(quest.subQuests, categoryContainer);
  });
}

function generateSubQuestElements(subQuests, categoryContainer) {
  //function generating the subquest task box
  subQuests.forEach((subQuest, index) => {
    //white connecting line
    const connectingLine = document.createElement("div");
    connectingLine.className = "connectingLine";
    connectingLine.innerHTML = "&nbsp;";

    //subQuest Container see func below
    const subQuestContainer = createSubQuestContainer(subQuest);
    categoryContainer.append(connectingLine);
    categoryContainer.append(subQuestContainer);

    //display on screen
    return subQuestContainer;
  });
}

function createInfoContainer(subQuest) {
  //element of subQuest container - info box
  const infoContainer = document.createElement("div");
  const infoContainerTitle = document.createElement("h3");
  const infoContainerLine = document.createElement("hr");
  const infoContainerInfo = document.createElement("p");

  //using classes to change the CSS of each element, refer to the CSS stylesheet
  infoContainer.className = "infoContainer";
  infoContainerInfo.className = "taskInfo";
  infoContainerLine.className = "horizontalLine";

  infoContainerTitle.innerText = "Info";
  infoContainerInfo.innerText = subQuest.info;
  infoContainer.append(infoContainerTitle);
  infoContainer.append(infoContainerLine);
  infoContainer.append(infoContainerInfo);

  return infoContainer;
}

function createTaskListContainer(subQuest) {
  //create the task list
  const taskListContainer = document.createElement("div");
  const taskListContainerTitle = document.createElement("h2");
  const taskListContainerLine = document.createElement("hr");
  const taskListContainerList = generateTaskListItems(subQuest.tasks);

  taskListContainer.className = "taskContainer";
  taskListContainerLine.className = "horizontalLine";
  taskListContainerTitle.innerText = "Tasks";

  taskListContainer.append(taskListContainerTitle);
  taskListContainer.append(taskListContainerLine);
  taskListContainer.append(taskListContainerList);

  return taskListContainer;
}

function createProgressBarContainer(subQuest) {
  //create the progress bar container - including the progress element
  const progressBarContainer = document.createElement("div");
  const progressBar = document.createElement("progress");

  progressBar.max = subQuest.tasks.length;
  progressBar.value = updateProgressBar(subQuest.tasks);
  progressBarContainer.className = "progressBarContainer";
  progressBarContainer.append(progressBar);

  return progressBarContainer;
}

function createTaskCard(subQuest) {
  //create overall task card - that includes infoContainer, taskListContainer, and progressBarContainer
  const taskCard = document.createElement("div");
  taskCard.className = "taskCard";
  const infoContainer = createInfoContainer(subQuest);
  const taskListContainer = createTaskListContainer(subQuest);
  const progressBarContainer = createProgressBarContainer(subQuest);
  taskCard.append(infoContainer);
  taskCard.append(taskListContainer);
  taskCard.append(progressBarContainer);

  return taskCard;
}

function createSubQuestContainer(subQuest) {
  //create subQuestContainer that adds a title to the taskCard
  const subQuestContainer = document.createElement("div");
  const subQuestTitle = document.createElement("h2");
  const taskCard = createTaskCard(subQuest);
  subQuestContainer.className = "team";
  subQuestTitle.innerText = subQuest.name;
  subQuestContainer.append(subQuestTitle);
  subQuestContainer.append(taskCard);

  return subQuestContainer;
}

function updateProgressBar(tasks) {
  //see if the current taskId has been checked - returns how many times it has been checked
  const completedTasks = tasks.filter((task) => {
    return tasksCompleted.includes(task.taskId);
  });
  return completedTasks.length;
}

function generateTaskListItems(tasks) {
  const taskList = document.createElement("div");
  taskList.className = "taskList";

  tasks.forEach((task) => {
    const taskListItem = document.createElement("div");
    taskListItem.className = "taskListItem";

    const taskName = document.createElement("p");
    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.onclick = () => {
      setCheckBoxCompletionStatus(task.taskId);
      updateProgressBar(tasks);
    };
    taskName.innerText = task.name;
    taskCheckbox.checked = determineTaskIsComplete(task.taskId);

    taskListItem.append(taskName);
    taskListItem.append(taskCheckbox);

    taskList.append(taskListItem);
  });
  return taskList;
}

function generateTeamContainerElements(quest) {
  const container = createElements();
  assignTeamContainerClasses(container);
  assignMiscAttributes(container, quest);

  appendElements(container);
  const teamsContainer = document.getElementById("teams-container");

  teamsContainer.append(container.teamContainer);
  return container.teamContainer;
}

function createElements() {
  const teamContainer = document.createElement("div");
  const team = document.createElement("div");
  const teamHeading = document.createElement("h2");
  const teamPicture = document.createElement("img");

  const generatedElements = {
    teamContainer: teamContainer,
    team: team,
    teamHeading: teamHeading,
    teamPicture: teamPicture
  };
  return generatedElements;
}

function assignTeamContainerClasses(container) {
  container.teamContainer.className = "team-container";
  container.teamPicture.className = "categoryIcon";
  container.team.className = "team";
}

function assignMiscAttributes(container, quest) {
  container.teamHeading.innerText = quest.category;
  container.teamPicture.src = quest.pictureSrc;
  container.teamPicture.width = 100;
}

function appendElements(container) {
  container.team.append(container.teamHeading);
  container.team.append(container.teamPicture);
  container.teamContainer.append(container.team);
}
