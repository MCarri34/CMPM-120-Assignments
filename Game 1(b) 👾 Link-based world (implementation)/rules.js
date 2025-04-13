class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("You have one goal: find the ancient texts of the ancients.");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        this.key = key;
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        if (locationData.Interactive === "RadioDish") {
            this.engine.addChoice("Rotate dish north", { action: "rotate", direction: "North" });
            this.engine.addChoice("Rotate dish east", { action: "rotate", direction: "East" });
            this.engine.addChoice("Rotate dish south", { action: "rotate", direction: "South" });
            this.engine.addChoice("Rotate dish west", { action: "rotate", direction: "West" });
        }

        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                if (choice.KeyRequired && !window.inventory?.includes(choice.KeyRequired)) continue;
                if (choice.OnlyIfNotInInventory && window.inventory?.includes(choice.ItemGained)) continue;
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (!window.inventory) window.inventory = [];

        if (choice) {
            if (choice.action === "rotate") {
                this.engine.show(`> You rotate the dish toward the ${choice.direction}.`);
                this.engine.show(`A fuzzy voice crackles: \"Signal from the ${choice.direction}... still nothing.`);
                this.create(this.key);
            } else {
                this.engine.show("&gt; " + choice.Text);
                if (choice.ItemGained && !window.inventory.includes(choice.ItemGained)) {
                    window.inventory.push(choice.ItemGained);
                    this.engine.show(`You picked up: ${choice.ItemGained}`);
                    if (choice.ItemGained === "Flashlight") {
                        this.engine.show("You click it on. The beam cuts through the darkness.");
                    }
                }
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
