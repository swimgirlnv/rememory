
interface Building {
    name: string;
    position: [number, number];
    memory: string;
    year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    media?: {images?: string[]; videoUrl?: string; audioUrl?: string;};
  }
  
  export const buildings: Building[] = [
    { name: 'Sayles Hall', position: [41.826158527287994, -71.40281566471815], memory: 'Great Adventure', year: 'Junior' },
    { name: 'Sci Li', position: [41.82705892280546, -71.40018400863207], memory: 'Naked Donut Run', year: 'Sophomore' },
    { name: 'CIT', position: [41.827090228925854, -71.39958416259826], memory: 'CIT challenge', year: 'Senior' },
    { name: 'Main Green', position: [41.8266, -71.4020], memory: 'Senior year graduation ceremony.', year: 'Senior' },
    { name: 'Hillel', position: [41.82802217229307, -71.4033261070682], memory: 
        `There is a damp hush settling over the room. The sound of shuffling feet and rustling clothes as we cram together in the stuffy space, a knee poking into a back here and an elbow jammed into a ribcage there. We shift uncomfortably for a moment, and out of the corner of our eyes, we catch a glimpse of quivering lips, of hands robotically moving to wipe away endless fast tears, of red red red eyes looking out upon the sea of bodies without really seeing us. They are searching for someone. And that someone is gone.
Sweat beads on our necks as we wait and rolls slowly down our aching backs. We focus on that, trying not to keep looking at the tears slowly flooding the room, trying to keep our own thoughts on the present. The man in all white robes comes and informs us we will be moving to a different space because there isn’t enough room for everyone here. More and more people keep coming.
We move to Hillel. Even with the larger space we are still crammed together, there are people even out in the hallway. It is still damp. To our right and left are people we know from sharing a team name, but in front of us and behind us are strangers. So many people. We feel like a fraud, we only met him once or twice, but still the hot tears leak out of us, snot builds in our nose, our heart burns, our stomach twists in agony at the thought of them being gone.
They were on his team. He had the most amazing eyes. And he was so kind and thoughtful, and everyone loved him.
They went to high school with him, and he was the type of person everyone looked up to. He was like a god.
They competed against him since middle school, and were so happy that they had chosen to go to the same school together.
They had lived with him for a summer, and they still had the playlists he made them. And they still listened to those playlists, like he was sending them a message.
They were his Japanese professor and had only known him for two months, but he had such a large impact on the small class and had been such a good student.
They had seen him Wednesday evening. Before it happened. He was buying chips at CVS, and they hoped those chips were the best damn chips he’d ever had.
We don’t know what happened. We are sure there are some that do, but we don’t want to pry. And even though we didn’t know him, we are still upset. Even now, four days later, as others seem to be enjoying themselves, we still can’t get that experience in Hillel out of our head. Perhaps not so much because of him, he appeared in my life for perhaps a minute at a party, and even then we only saw him playing poker at the table with the other guys. But he had been there. He had been in that chair. He had been playing poker. With the other guys.
We’ve struggled with thoughts of death. We’ve thought of it as a deep sleep that we never wake up from, a final rest that felt much needed at different points in our lives. And news of his passing occurred as our own thought of endless sleep was sounding overwhelmingly appealing
But going in that room. Seeing the sea of athletics gear that wasn’t just swim and dive. Seeing the tears forming in red red red eyes around the room. Seeing people who had graduated coming back for the ceremony. Seeing roommates, classmates, professors, teammates, coaches, friends, family, all coming together despite the sweaty heat of the afternoon, the cramped space, the discomfort.

And then going out into the world and trying to create a sense of normalcy. We didn’t know him, but he had been here, had been in the CVS just 48 hours ago. And life is expected to just go on as usual. We didn’t even know him, so why does it hurt so much? We like to think that going to the ceremony was a good thing. It showed us that people care, people will notice your absence, people will feel this pain if we were gone. And at the same time, our brain could only spit out *you’re next you’re next you’re next you’re next you’re next you’re next you’re next you’re next you’re next you’re next you’re next you’re next.*


Life would move on without us in it, swim practices would continue. Classes would continue. Deadlines, races, internships, jobs, graduation, everything would continue if we weren’t here. Except maybe there would be that one person who, like us, didn’t even know who we were and yet they couldn’t keep moving forward.
`, year: 'Sophomore' },
    { name: 'Katherine Moran Aquatic Center', position: [41.83033143131877, -71.3971432825428], memory: 'Poo', year: 'Freshman' },
    { name: 'Hegeman Hall', position: [41.825681871605966, -71.4005603063427], memory: 'Sophomore year dorm.', year: 'Sophomore' },
    { name: 'Hope College', position: [41.82680252687402, -71.40381810624025], memory: 'Freshman + Sophomore year dorm.', year: 'Freshman' },
    { name: 'Home', position: [38.572698308170835, -121.38795067728698], memory: 'CS19 during the pandemic.', year: 'Freshman'},
    { name: 'Home', position: [39.26853838311791, -119.94829104194658], memory: 'Going back during the summer.', year: 'Sophomore'},
    { name: 'Dorm', position: [34.071752188995454, -118.45289062801939], memory: 'Dorm', year: 'Junior'},
    { name: 'Meinitz Hall', position: [34.076369229393016, -118.44036077560264], memory: 'Classroom', year: 'Junior'},
    { name: 'Home', position: [37.79464219952082, -122.43754416370119], memory: 'Going back during the summer.', year: 'Senior'},
    { name: 'Home', position: [32.69038738598935, -117.18749154352908], memory: 'First semester of the pandemic', year: 'Freshman'},
    { name: 'Petty', position: [42.37060237177755, -71.12148616799445], memory: 'FETE', year: 'Junior'},
    ];
