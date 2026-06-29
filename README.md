(0:12) Okay (0:42) Yeah (1:12) Okay (1:17) Okay (1:27) Okay (1:42) Other three are coming under group test environment. Okay, so you have PTE, under PXP and PTE, you will see there are two data centres. (1:49) SAT, two data centres.
(1:52) UAT, two data centres. (1:53) Okay, good. (1:54) Now, I hope you understand the hierarchy, right? (1:56) So, we have a Kubernetes CD.
(1:58) Which is that you have a releaser, this folder. (2:03) Yeah (2:03) Why we have it? Because the charts, you should not touch it. As a developer, you should not touch it.
(2:07) This will be done by the enterprise level. You don't have to worry about the charts. (2:10) How about the Helm's chart comes in, like the whole process we are hitting.
(2:14) Helm's chart, exactly. This is about Helm's chart only. (2:17) If we have it, it doesn't mean that we shouldn't touch it.
(2:19) We have it and what it will do is, it will read your file here and it will put it in the appropriate place. (2:24) Actually, if it is applying, this is the file we will be, your harness will be using. (2:28) It won't use this file.
(2:29) This is like you are giving the information and take the information, put it in appropriate place. (2:33) This will be used for the deployment. (2:35) Okay.
(2:35) But yeah, you can understand, but not now. (2:37) There will be too much worry. (2:38) Sure, sure.
(2:39) So now, if you go to every data centre, you will see one file. (2:43) Everything will have values.yaml. (2:45) Every single folder have a values.yaml. (2:47) Okay, so this service you should understand. (2:49) Now, if you go to the values.yaml, any values, I think something random, okay? (2:54) So, don't try to understand everything.
(2:56) See here, this is the environment. (2:59) Can you see? This is what you have to update. (3:03) Right? You have to understand this part.
(3:06) Okay, from here to here, I will give the link so that you will understand what we are doing. (3:10) This is nothing but a QA paper. (3:13) Okay.
(3:14) But a QA paper. (3:18) I am giving this just for your reference. (3:22) No, I am giving product now.
(3:23) That's okay, the product. (3:25) I mean, you won't do anything. (3:28) Yeah, sure.
(3:29) Yeah, yeah. (3:31) From here, do you see any collection or something? (3:39) No, right? (3:39) Any database, nothing for now? (3:42) No. (3:43) Okay.
(3:45) So, here if you take, it is nothing but a key value. (3:47) There is a key, there is a value. (3:48) If you go for random, here is a DB box.
(3:51) What is the value? (3:53) And you will be using it, right? (3:54) For example, Phoenix URL. (3:57) Yeah, this is where you are going to fit it, right? (3:59) So, you have to put the key name, put the value. (4:01) Name, key, value, value.
(4:03) That is how you have to add. (4:05) So, what is your city repo? (4:07) What is the company name? (4:09) Supervisor Evaluation Service. (4:11) Supervisor Evaluation.
(4:13) Yeah, this one. (4:17) So, here also you can create a feature. (4:18) Same thing.
(4:20) Base code, something like that. (4:21) Make it the same so that you can easily remember. (4:24) Here, you don't have any branches.
(4:27) Oh, it is there. (4:28) Base code you created. (4:29) Yeah.
(4:31) Okay. (4:31) So, here, go to Kubernetes. (4:34) Releases.
(4:36) Initially, go with the dev. (4:38) And there should be two data sets. (4:39) See, this is where, how you will be ordering, how it is created.
(4:41) This is where when you submit IDP, all this is created. (4:45) You didn't do this manually. (4:46) Yeah.
(4:47) So, this is what exactly IDP is doing for you. (4:49) Okay. (4:49) The moment you say, hey, I want Python component, blah, blah, blah.
(4:56) You put the charts and data set. (4:59) You can see the dev. (5:01) Because this is where you associated something, right? (5:05) Where you first time you did a mistake.
(5:06) Yeah, yeah, correct. (5:08) So, this is where it is needed. (5:09) Okay.
(5:26) Okay. (5:34) Okay. (5:48) Okay.
(5:50) Okay. (5:50) Yeah, okay, sure. (5:51) Got it.
(5:52) That's fine. (6:12) Okay. (6:12) So, you take this as a standard of re-testing.
(6:15) For example, you should be supervisor, evaluation, service. (6:20) Yeah. (6:23) So, comparatively, keep doing it, okay? (6:25) Then let me know.
(6:26) Then we will create a definitive way. (6:30) I can do that. (6:31) But I want you to do this, so that there is no point of you being part of this one, right? (6:34) Yeah.
(6:35) So, try to do that and let's step by this as soon as possible. (6:39) Cool. (6:39) Cool.
(6:40) Good news is, you don't have any secrets. Otherwise, one more confusion will come. (6:44) What is the confusion? It's a vault.
(6:46) For example, if you are having a TV password or something like that, you have to put it in the vault and then you have to confirm it. (6:51) You can't see it in plain English here. (6:53) So, at the time of deployment, it will go to the vault and detect the particular value given for that.
(6:58) This is also a key benchmark, but it is in the vault. (7:01) If I put it here, you will be able to see right password, blank password. (7:04) So, for that, we are putting it here.
(7:06) But later on, when we will be adding some more code, as of now, we are coming with the evaluation service. (7:14) So, I am maintaining a core part of it, service part of it. (7:18) But later on, I was thinking that when we are going to scale it, we will be adding MongoDB.
(7:24) So, for the Mongos, we have to have some master code over there, which could be reusable. (7:32) For example, suppose if we are just extracting the names or anything from Mongos, (7:40) I would be maintaining some master where we are just reusing the code. (7:44) And for DB connection also, we will be having some keys and password.
(7:51) We have to maintain that. (7:52) So, for here, we will be having that vault? (7:54) Yeah, yeah. Look at the highlighter.
(7:57) Yeah. (7:57) Mongo password. (7:58) So, here, what you do is, you go to this vault.
(8:00) In the vault, we have our own path. (8:03) So, here, our own path. (8:05) Then, you are giving the MongoDB password.
(8:09) So, this will be exchanged with the actual value. (8:12) But when you have to do the deployment, you cannot see it anywhere. (8:16) Okay.
(8:17) You cannot see it anywhere. (8:18) So, that is how we are protecting the sensitive information. (8:20) Not only passwords, for example, certificate.
(8:22) Yeah. (8:22) And any key, API key, right? (8:27) This is where we are going for the tech API key, right? (8:29) Yeah. (8:29) If I put it in plain English here, (8:32) it will be having access, come and see the sequence.
(8:34) So, this is a violation. (8:35) That is why we are classifying the same key whenever either plain English, plain text, (8:39) or go to the vault. (8:40) As of now, good.
(8:41) Lucky that you are not having any vault sensitive information. (8:44) But usually, you have. (8:45) The moment you onboard Mongo, you have to go to the vault first.
(8:47) It has the password there. (8:48) And come and use it here. (8:50) Sure, sure.
(8:51) Okay, understood. (8:51) Yeah. (8:52) Firstly, with this information, get started.
(8:55) I know that you have a bit challenging understanding on this. (8:58) Keep going. (8:58) Come back to the first link which I gave you.
(9:00) And accordingly, do the changes to the second link. (9:02) And let me know. (9:03) Go for only Dev.
(9:04) Okay, for now. (9:04) Oh, yeah. (9:05) I mean, the Advisor GPT.
(9:07) I mean, this would be helpful. (9:08) I mean, I will compare and I will. (9:09) Yeah.
(9:10) And whatever you are doing, that has to be replicated here also. (9:14) But for now, complete with the two datacenters. (9:16) When you say, hey, go and deploy Dev, create and deploy two datacenters.
(9:19) But for now, let's deploy only one datacenter. (9:21) So, only about Garland 6. (9:24) If these are successful, then what we can do? (9:26) We can compute the value from here to here. (9:27) Then I'll deploy, because Harvard gives some flexibility.
(9:30) How many datacenters you want to deploy? (9:32) I can say, if I now go and deploy only 0, Garland. (9:35) Don't go for both. (9:36) Okay.
(9:36) When this is successful, move the value to here. (9:38) That time, I'll go and say, Harvard, go and deploy both datacenters. (9:42) Okay, got it.
(9:44) Got it. (9:46) So, with this, keep going. (9:47) Because she is good.
(9:50) Because she is working on the early images in production code. (9:52) So, she doesn't have to touch anything. (9:54) But for you, it's a fresh code, right? (9:55) So, you have to do this one.
(9:57) Yeah, sure. (9:58) I will go through it. (10:00) And for me, this would be the one part.
(10:05) And soon, we are having a meeting with Akash. (10:07) So, Akash Tamar. (10:09) So, for him, we have to do a demo video.
(10:12) So, Umai and Ishita are working on that as well. (10:15) Parallelly. (10:17) What demo video? (10:19) We are preparing a recorded video kind of like so that we would be having like five minutes.
(10:25) Because what happens when we do in one go, like it sometimes crosses five or ten minutes, of course. (10:31) So, Prashanth and... (10:32) So, what should we do? (10:34) That is, what is that? (10:35) IDP, reference set, and... (10:38) That we have presented last time. (10:41) Onboarding, we have done last time.
(10:43) So, now we are going to like model resiliency framework and the evaluation part. (10:48) Okay, okay. (10:50) Yeah, yeah.
(10:51) Okay, when is that? (10:52) They haven't come up with any date, but they are just... (10:55) The way I'm saying, let's say we have made a good progress on the... (11:01) Maybe Ishita, I'll ask Ishita to talk to me. (11:03) I'll give the screenshot or whatever. (11:06) Or once we interpret, she can do whatever she has.
(11:08) Or I can give her some screenshots so she can use it. (11:11) Sure, sure. (11:12) I will let her know this thing.
(11:14) And the next thing, like, this is the first thing we are planning as of now. (11:18) Because if we are going with hallucinations, so that it should be 100% what I'm thinking. (11:22) That it should not be like half thing.
(11:24) We should be able to explain like what span and like... (11:28) I mean, I'm not going too much on depth this time. (11:30) So, I will be covering like from like more from a business point of view in front of them. (11:35) And like second, like we have to connect with the tech expert as well.
(11:39) So, the other team are... (11:41) So, we have to like demo like everything again, what we have built it. (11:46) I just for now, like I've just given my personal report where I've pushed my code. (11:50) So, they are just going through it.
(11:52) And more like we have to update the conference page for the last two weeks. (11:56) So, I will do it today. (11:58) And for the admin and for the... (12:00) We had a plan for the UI, right? (12:02) So, one is for the like... (12:03) We can either go with the admin UI, which Vim is already having.
(12:07) Another one is we can come up with another microservices for UI. (12:10) So, I mean, that could be a later part of it. (12:12) So, more would be set up and all like... (12:14) So, as of now, I'm just focussing on this part like with Akash, Dharma and presentation and the tech expert team and conference page.
(12:21) And so, I mean, we'll be on the same page. (12:24) And yeah, I will go with this CD report. (12:26) Yeah, I mean, keep this as a priority.
(12:28) The supply should be a priority. (12:29) Because this is being a huge difference in your work. (12:32) Because you are almost there.
(12:33) Just you have to make converting to research. (12:35) That's it. (12:36) You are almost there.
(12:37) Just we have to get right. (12:38) Today, you try. (12:39) But I will help you also.
(12:40) And once you are done with the draft, I will review that and try to help you to get right. (12:44) Oh, sure. (12:44) I will try to like learn this today.
(12:46) Yeah, yeah, yeah. (12:47) I will do it. (12:49) CD report.
(12:50) Okay. (12:51) Yeah, that's all. (12:52) Yeah, that's it.
(12:53) Yeah, yeah. (12:55) Sure. (12:56) Anyway, today, I will be using the admin today because I have a meeting from 5.30pm to 2.30am. (13:01) Okay, I mean, it's a planning meeting.
(13:03) I will be online. (13:04) I have seen you last night as well. (13:06) 2.30pm. (13:07) So, I was wondering like.
(13:10) Yeah, a lot of things are happening. (13:13) Okay, I think, I mean, if you see, if you are coming in a good shape, right, I can push you more work. (13:18) Even I can give my workers something.
(13:20) I said, I am closing the ATM. (13:21) But you guys are still struggling to get it done, right? (13:23) So, you can see we are halfway through. (13:25) Right? (13:25) Yeah.
(13:26) So, please cut it. (13:27) Really, I need a hand. (13:28) And also, okay, now, one more point.
(13:32) See, now we have three meetings in the calendar. (13:35) 11.30pm, our 12.30pm. (13:37) 12.30pm. (13:39) 12.30pm and one more in the evening. (13:41) So, we should get out of one meeting.
(13:42) Maybe 12.30pm we can cancel. (13:44) You start joining the 11.30pm meeting. (13:47) Okay.
(13:47) That's the regular thing. (13:48) Because now we have a Scalp Master in India. (13:50) I would have told you earlier.
(13:51) Now, we have a Barber Scalp Master in India. (13:53) Now, you are part of the board. (13:55) You will have your own story.
(13:57) You have to tell me what you want to achieve in the next two weeks or so. (13:59) Let's create a story for this. (14:01) So, it will be in your book.
(14:02) You can keep giving the update. (14:03) And in the evening call also, you can join and give the update. (14:06) You don't have to stay in the entire company.
(14:08) Just join. (14:08) There must be a particular update. (14:09) You can come in.
(14:10) If you are interested, stay. (14:11) A lot of things will be discussed. (14:13) Sure.
(14:14) That 7.30pm you are talking about? (14:17) Exactly. (14:17) 7.30pm. (14:19) Okay. (14:19) The founders one.
(14:20) Yes. (14:21) The founders. (14:22) Morning, we can cancel the 12.30pm. (14:24) Instead, let's join 11.30pm. (14:26) If we need any special meeting, then we can have another meeting.
(14:28) Otherwise, we don't have that. (14:29) Because it's too many meetings now for you. (14:31) Three is too much for you.
(14:34) Sure. (14:35) Yeah, we can keep 11.31pm and 12.30pm we can cancel. (14:38) And 7.30pm like.
(14:39) And for the story like. (14:41) I mean. (14:42) How we are going to keep it.
(14:44) Like for. (14:44) I mean it's going to be. (14:46) You have a bullet table list.
(14:47) What you want to achieve. (14:48) What is the plan for next two weeks. (14:49) Because sprint starts by Wednesday.
(14:51) Okay. (14:52) So, next two weeks what you can achieve is. (14:54) You can say.
(14:55) Deploy this in dev. (14:57) Right. (14:57) I guess I used number one.
(14:59) And number two is. (15:02) I mean. (15:04) Let's take this too lightweight.
(15:05) Okay. (15:06) For Ishita, we can say. (15:07) Deploy in that.
(15:08) Resiliency in dev. (15:10) Okay. (15:10) Let's have three.
(15:11) These three codes. (15:12) Okay. (15:12) Keep it light.
(15:14) Let's keep progressing. (15:16) Okay. (15:17) Sure.
(15:17) Got it. (15:20) Okay. (15:21) Thanks.
(15:22) Let me know the three points. (15:23) Okay. (15:24) Discuss with Ishita.
(15:24) Two points you have to discuss with Ishita. (15:26) Number one. (15:27) About the meeting cancellation.
(15:28) Right. (15:29) Yeah. (15:29) Number two.
(15:30) Once you are done shooting. (15:38) I mean. (15:39) I mean.
(15:42) I mean. (15:43) I mean. (15:47) I mean.
(15:50) I mean. (15:53) I mean. (16:00) I mean.
(16:00) I mean. (16:01) I mean. (16:01) I mean.
(16:01) I mean. (16:01) I mean. (16:01) I mean.
(16:01) I mean. (16:01) I mean. (16:01) I mean.
(16:04) I mean. (16:04) I mean. (16:08) Thank you.
(16:10) Yeah thanks. (16:12) Yes. (16:16) Yeah, sure.
(16:19) Yes. (16:21) Yeah. (16:22) Thanks.
(16:23) Yes.



PROBLEM STATEMENT : 
Today, our AI systems generate thousands of interactions every single day. At that scale, you simply cannot ask humans to manually check every response. It is not practical.
Second, without automation, we have no reliable way to catch hallucinations, wrong answers, or harmful outputs in production. Things slip through.
Third, when problems are caught late, they hurt customer trust and bring compliance risk.
And fourth, our current process depends on people manually reviewing spans, which delays both insight and fix.


PROPSED TARGET :
We want real-time, automated evaluation using strong production LLMs. We want a plugin-based system so we can quickly add new checks — hallucination today, toxicity tomorrow, then relevance, then security. We want this to plug directly into Overwatch so every result is annotated and auditable. 



EXPECTED BUSINESS OUTCOME :
What does the business get out of all this?

Faster insight, because automated scoring replaces manual review
Better output quality, because we catch issues early
Better cost efficiency, because we use Claude for scoring and Gemini for suggestions  the right model for the right job and also we are using synthetic dataset for validating the model.
Scalability to handle 10,000-plus spans with no human bottleneck
And full compliance and audit trail through complete annotations
