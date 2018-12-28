var VTTJS = require('vtt.js');

module.exports = function(url) {
    return new Promise(function(resolve) {
        var nativeVTTCue = VTTCue;
        global.VTTCue = VTTJS.VTTCue;
        var cues = [];
        var parser = new VTTJS.WebVTT.Parser(window, VTTJS.WebVTT.StringDecoder());
        parser.oncue = function(cue) {
            cues.push({
                startTime: cue.startTime,
                endTime: cue.endTime,
                text: cue.text
            });
        };
        parser.parse(demoText);
        parser.flush();
        cues = cues.sort(function(c1, c2) {
            return c1.startTime - c2.startTime ||
                c1.endTime - c2.endTime;
        });
        global.VTTCue = nativeVTTCue;
        resolve(cues);
    });
};

var demoText = `WEBVTT

00:00:20.000 --> 00:00:40.000
20-40

00:00:05.000 --> 00:00:10.000
5-10

00:00:02.000 --> 00:00:10.000
2-10

00:00:00.000 --> 00:00:10.000
0-10

00:00:00.000 --> 00:00:20.000
0-20

00:00:00.000 --> 00:00:38.000
0-38

00:00:00.000 --> 00:00:15.000
0-15

00:00:50.000 --> 00:05:55.000
50-5:55

00:02:50.000 --> 00:04:55.000
2:50-4:55

00:00:50.000 --> 00:01:55.000
50-1:55
`;

// demoText = `WEBVTT

// 1
// 00:00:11.000 --> 00:00:12.500
// <font color="#FFFF66"><i>HAVE A GOOD TIME.<i>

// 2
// 00:03:06.186 --> 00:03:09.982
// They've killed your son Paolo!

// 3
// 00:03:10.315 --> 00:03:12.442
// Murderers! Murderers!

// 4
// 00:03:23.287 --> 00:03:24.788
// My son...

// 5
// 00:04:09.124 --> 00:04:11.543
// All my respect, Don Ciccio.

// 6
// 00:04:15.714 --> 00:04:19.718
// You killed my husband because
// he wouldn't give in to you.

// 7
// 00:04:20.344 --> 00:04:22.679
// And his oldest son Paolo...

// 8
// 00:04:23.472 --> 00:04:25.974
// ...because he swore revenge.

// 9
// 00:04:27.184 --> 00:04:30.771
// But Vito is only nine.
// And dumb-witted.

// 10
// 00:04:31.647 --> 00:04:33.273
// He never speaks.

// 11
// 00:04:33.357 --> 00:04:35.734
// It's not his words I'm afraid of.

// 12
// 00:04:36.985 --> 00:04:40.906
// He's weak. He couldn't hurt anyone.

// 13
// 00:04:41.865 --> 00:04:44.660
// But when he grows, he'll grow strong.

// 14
// 00:04:45.077 --> 00:04:48.747
// Don't worry. This little boy
// can't do a thing to you.

// 15
// 00:04:56.213 --> 00:04:59.633
// When he's a man, he'll
// come for revenge.

// 16
// 00:05:01.468 --> 00:05:05.597
// I beg you, Don Ciccio,
// spare my only son.

// 17
// 00:05:06.431 --> 00:05:08.517
// He's all I have left.

// 18
// 00:05:08.809 --> 00:05:13.939
// I swear to God he'll never do
// you any harm. Spare him!

// 19
// 00:05:23.240 --> 00:05:24.199
// Vito, run!

// 20
// 00:05:24.283 --> 00:05:25.409
// Move and I'll kill him!

// 21
// 00:05:27.411 --> 00:05:28.912
// Run, Vito!

// 22
// 00:05:34.626 --> 00:05:35.878
// Kill him!

// 23
// 00:05:45.220 --> 00:05:49.766
// Any family who hides the boy
// Vito Andolini will regret it!

// 24
// 00:05:52.019 --> 00:05:53.353
// You understand?

// 25
// 00:06:02.779 --> 00:06:07.618
// Anybody who hides the boy
// Vito Andolini is in for trouble!

// 26
// 00:06:33.435 --> 00:06:35.729
// Vito, we're praying for you!

// 27
// 00:06:41.318 --> 00:06:45.113
// If anyone is hiding the boy
// Vito Andolini...

// 28
// 00:06:46.198 --> 00:06:48.033
// ...turn him over to us.

// 29
// 00:06:48.784 --> 00:06:51.537
// Don Ciccio will thank you for it!

// 30
// 00:06:52.913 --> 00:06:55.833
// It'll be better for the boy,
// and better for you!

// 31
// 00:07:07.886 --> 00:07:12.558
// Any family who hides the boy
// Vito Andolini will regret it!

// 32
// 00:08:45.859 --> 00:08:47.611
// Nurse.

// 33
// 00:09:13.595 --> 00:09:15.347
// Money?

// 34
// 00:09:16.640 --> 00:09:18.642
// Interpreter!

// 35
// 00:09:24.940 --> 00:09:27.359
// Where are you from?

// 36
// 00:09:27.693 --> 00:09:29.820
// -What is your name?
// -Maria.

// 37
// 00:09:34.157 --> 00:09:36.368
// What is your name?

// 38
// 00:09:37.661 --> 00:09:40.789
// Come on, son. What is your name?

// 39
// 00:09:43.917 --> 00:09:46.879
// Vito Andolini from Corleone.

// 40
// 00:09:47.671 --> 00:09:50.299
// Corleone. Vito Corleone.

// 41
// 00:09:50.799 --> 00:09:53.427
// Okay, over there.

// 42
// 00:09:54.344 --> 00:09:55.554
// Next.

// 43
// 00:10:04.938 --> 00:10:09.318
// Tell him he has smallpox.
// Quarantine three months.

// 44
// 00:10:18.368 --> 00:10:20.829
// Vito Corleone!

// 45
// 00:10:21.455 --> 00:10:23.707
// Vito Corleone!

// 46
// 00:10:25.417 --> 00:10:27.920
// Here he is. This is him.

// 47
// 00:12:14.484 --> 00:12:16.653
// Did you bring the car keys?

// 48
// 00:12:18.906 --> 00:12:21.491
// Laurie! Laurie!

// 49
// 00:12:41.762 --> 00:12:43.847
// Mama!

// 50
// 00:12:44.848 --> 00:12:46.642
// Mama!

// 51
// 00:12:48.894 --> 00:12:51.563
// -Look who's here.
// -Father Carmelo.

// 52
// 00:12:51.647 --> 00:12:54.900
// -This is Father Carmelo.
// -I'm Merle Johnson.

// 53
// 00:12:56.693 --> 00:12:58.403
// Mama!

// 54
// 00:12:59.321 --> 00:13:03.575
// -Here I am.
// -Constanzia, after one week?

// 55
// 00:13:03.659 --> 00:13:07.704
// I sent the car to the airport last week
// to pick you up.

// 56
// 00:13:07.788 --> 00:13:13.752
// It was chaos. Anyway, here I am, just
// one week late. This is for my mama!

// 57
// 00:13:13.836 --> 00:13:17.047
// -What is this?
// -You remember Merle?

// 58
// 00:13:17.214 --> 00:13:19.883
// Hello. How are you? Thank you.

// 59
// 00:13:20.050 --> 00:13:25.514
// Where's Michael? I've got to talk to him
// and I can't wait on line.

// 60
// 00:13:25.597 --> 00:13:27.975
// You go see your children first.

// 61
// 00:13:28.100 --> 00:13:33.730
// Then you worry about waiting on line to
// see your brother. Like everybody else.

// 62
// 00:13:38.569 --> 00:13:41.071
// <i>Ladies and gentlemen...</i>

// 63
// 00:13:41.822 --> 00:13:45.450
// <i>A most distinguished guest
// would like to say a few words.</i>

// 64
// 00:13:45.534 --> 00:13:49.621
// <i>Please welcome Senator Pat Geary
// of the State of Nevada.</i>

// 65
// 00:13:49.705 --> 00:13:52.499
// <i>And there is Mrs. Geary.</i>

// 66
// 00:14:02.885 --> 00:14:05.095
// <i>Thank you very much.</i>

// 67
// 00:14:05.262 --> 00:14:11.977
// <i>This is a very, very happy day
// for me and my wife Mrs. Geary.</i>

// 68
// 00:14:12.561 --> 00:14:15.689
// <i>We see Nevada far too seldom.</i>

// 69
// 00:14:15.772 --> 00:14:20.694
// <i>But today we can join with old friends,
// we can make new friends</i>

// 70
// 00:14:20.944 --> 00:14:24.740
// <i>and we help celebrate
// a young man's first Communion.</i>

// 71
// 00:14:25.365 --> 00:14:32.289
// <i>And also to thank that boy's family for
// a magnificent contribution to the State.</i>

// 72
// 00:14:32.372 --> 00:14:38.170
// <i>I have here in my hand a check
// made out to the university</i>

// 73
// 00:14:38.253 --> 00:14:43.091
// <i>and it is a magnificent endowment
// in the name of</i>

// 74
// 00:14:44.510 --> 00:14:47.262
// <i>Anthony Vito Corleone.</i>

// 75
// 00:14:48.305 --> 00:14:51.433
// <i>The check is signed by
// that young man's parents</i>

// 76
// 00:14:51.600 --> 00:14:54.353
// <i>whom I think we should recognize.</i>

// 77
// 00:14:54.436 --> 00:14:58.899
// <i>Mike, Pat, Kay, stand up, please.
// Let the folks see you!</i>

// 78
// 00:14:58.982 --> 00:15:01.026
// <i>Folks, I want you to join me</i>

// 79
// 00:15:01.109 --> 00:15:06.865
// <i>in giving a real Nevada thank you
// to Mr. and Mrs. Michael Corleone!</i>

// 80
// 00:15:12.746 --> 00:15:18.085
// <i>We also have, as a special added
// attraction, the Sierra Boys Choir</i>

// 81
// 00:15:18.252 --> 00:15:24.591
// <i>who have chosen a certain special song
// and a special arrangement</i>

// 82
// 00:15:24.675 --> 00:15:28.679
// <i>to honor their host,
// Mr. Michael Corleone.</i>

// 83
// 00:15:28.846 --> 00:15:30.347
// <i>Boys.</i>

// 84
// 00:15:46.864 --> 00:15:49.032
// The plaque.

// 85
// 00:15:49.199 --> 00:15:51.743
// Okay, fellows, did you get that one?

// 86
// 00:15:52.578 --> 00:15:54.705
// Okay, that's good.

// 87
// 00:15:54.872 --> 00:15:58.917
// Now, Senator,
// just you and Mrs. Corleone.

// 88
// 00:16:20.397 --> 00:16:23.400
// My lawyer Tom Hagen. Senator Geary.

// 89
// 00:16:23.483 --> 00:16:26.612
// He arranged everything
// through your man Turnbull.

// 90
// 00:16:26.737 --> 00:16:29.865
// -Yes, yes.
// -Sit down.

// 91
// 00:16:33.035 --> 00:16:36.497
// I thought that you and
// I would talk alone.

// 92
// 00:16:37.915 --> 00:16:43.754
// I trust these men with my life, Senator.
// To ask them to leave would be an insult.

// 93
// 00:16:43.879 --> 00:16:46.840
// Well, it's perfectly all right with me

// 94
// 00:16:46.924 --> 00:16:51.595
// but I am a blunt man and I intend
// to speak very frankly to you.

// 95
// 00:16:51.720 --> 00:16:53.764
// Maybe more frankly

// 96
// 00:16:53.847 --> 00:16:57.184
// than anyone in my position
// has ever talked to you before.

// 97
// 00:16:57.351 --> 00:17:00.354
// The Corleone family
// has done well in Nevada.

// 98
// 00:17:00.521 --> 00:17:05.651
// You own, or control,
// two major hotels in Vegas

// 99
// 00:17:05.734 --> 00:17:10.280
// and one in Reno.
// The licenses were grandfathered in

// 100
// 00:17:10.364 --> 00:17:13.784
// so there was no problem
// with the Gaming Commission.

// 101
// 00:17:15.786 --> 00:17:18.747
// Now my sources tell me

// 102
// 00:17:18.831 --> 00:17:22.918
// that you plan to make a move
// against the Tropigala.

// 103
// 00:17:23.001 --> 00:17:28.048
// They tell me that within a week,
// you're going to move Klingman out.

// 104
// 00:17:28.173 --> 00:17:33.929
// Quite an expansion. However, it will
// leave you with a little technical problem.

// 105
// 00:17:36.473 --> 00:17:39.309
// The license will still be
// in Klingman's name.

// 106
// 00:17:40.602 --> 00:17:45.148
// -Turnbull is a good man.
// -Yeah, well, let's cut out the bullshit.

// 107
// 00:17:45.232 --> 00:17:48.402
// I don't want to spend
// more time here than I have to.

// 108
// 00:17:48.485 --> 00:17:50.946
// You can have the license.

// 109
// 00:17:51.029 --> 00:17:53.907
// The price is 250,000 dollars.

// 110
// 00:17:53.991 --> 00:17:56.660
// Plus five per cent of the gross monthly

// 111
// 00:17:56.743 --> 00:18:01.248
// of all four hotels, Mr. Corleone.

// 112
// 00:18:04.835 --> 00:18:09.756
// The price for the license
// is less than 20,000 dollars, right?

// 113
// 00:18:09.840 --> 00:18:12.259
// That's right.

// 114
// 00:18:12.342 --> 00:18:17.890
// -Why would I pay more than that?
// -Because I intend to squeeze you.

// 115
// 00:18:17.973 --> 00:18:20.601
// I don't like your kind of people.

// 116
// 00:18:20.684 --> 00:18:26.231
// I don't like to see you come out
// to this clean country in oily hair

// 117
// 00:18:26.315 --> 00:18:28.692
// dressed up in those silk suits

// 118
// 00:18:28.775 --> 00:18:32.696
// and try to pass yourselves off
// as decent Americans.

// 119
// 00:18:32.821 --> 00:18:38.452
// I'll do business with you, but the fact is
// that I despise your masquerade,

// 120
// 00:18:38.535 --> 00:18:44.041
// the dishonest way you pose yourself
// and your whole fucking family.

// 121
// 00:18:51.548 --> 00:18:53.383
// Senator,

// 122
// 00:18:54.468 --> 00:18:57.554
// we're both part of the same hypocrisy.

// 123
// 00:18:59.056 --> 00:19:02.559
// But never think it applies to my family.

// 124
// 00:19:03.185 --> 00:19:05.687
// All right, all right.

// 125
// 00:19:06.522 --> 00:19:11.652
// Some people have to play little games.
// You play yours.

// 126
// 00:19:13.737 --> 00:19:17.824
// Let's say that you'll pay me
// because it's in your interest.

// 127
// 00:19:18.575 --> 00:19:22.996
// I want your answer and the money
// by noon tomorrow. One more thing.

// 128
// 00:19:23.080 --> 00:19:26.667
// Don't you contact me again, ever.

// 129
// 00:19:26.750 --> 00:19:30.587
// From now on you deal with Turnbull.
// Open that door, son.

// 130
// 00:19:31.088 --> 00:19:34.925
// Senator, you can have my answer now
// if you like.

// 131
// 00:19:37.511 --> 00:19:40.347
// My offer is this...

// 132
// 00:19:40.514 --> 00:19:42.099
// Nothing.

// 133
// 00:19:43.767 --> 00:19:49.439
// Not even the fee for the gaming license,
// which I would like you to put up.

// 134
// 00:19:54.695 --> 00:19:57.155
// Good afternoon, gentlemen.

// 135
// 00:19:59.825 --> 00:20:02.536
// Ladies! I didn't know you were out here.

// 136
// 00:20:02.619 --> 00:20:05.706
// -Honey, we have to go.
// -Really? I'm sorry.

// 137
// 00:20:05.873 --> 00:20:09.209
// -It's been delightful.
// -It was our pleasure.

// 138
// 00:20:09.376 --> 00:20:11.962
// It was wonderful talking to you.

// 139
// 00:20:56.507 --> 00:21:01.678
// Fredo! Fredo, you son-of-a-bitch,
// you look great!

// 140
// 00:21:01.762 --> 00:21:03.764
// Frank Pentangeli!

// 141
// 00:21:03.847 --> 00:21:06.975
// I thought you was
// never coming out west, you big bum!

// 142
// 00:21:07.976 --> 00:21:10.729
// I've got to check on my boys.

// 143
// 00:21:11.897 --> 00:21:13.857
// -What's with the food here?
// -What's the matter?

// 144
// 00:21:13.982 --> 00:21:19.821
// A kid gives me a Ritz cracker
// with chopped liver and says, "canapés".

// 145
// 00:21:19.988 --> 00:21:25.202
// I said, "Can of peas, my ass. That's
// a Ritz cracker and chopped liver!"

// 146
// 00:21:28.497 --> 00:21:31.625
// Bring out the peppers and sardines!

// 147
// 00:21:32.251 --> 00:21:35.546
// Seeing you reminds me of New York
// in the old days!

// 148
// 00:21:36.713 --> 00:21:42.219
// You remember Willi Cicci, who was
// with old man Clemenza in Brooklyn?

// 149
// 00:21:44.555 --> 00:21:47.975
// We were all upset about that.
// Heart attack, huh?

// 150
// 00:21:48.058 --> 00:21:51.144
// No, that was no heart attack.

// 151
// 00:21:51.478 --> 00:21:55.482
// That's what I'm here to see
// your brother Mike about.

// 152
// 00:21:55.566 --> 00:21:58.569
// -But what's with him?
// -What do you mean?

// 153
// 00:21:58.694 --> 00:22:04.074
// Do I have to get a letter of introduction
// to get a sit-down?

// 154
// 00:22:04.241 --> 00:22:08.787
// -You can't get in to see Mike?
// -He's got me waiting in a lobby!

// 155
// 00:22:12.457 --> 00:22:15.544
// -Johnny Ola.
// -Al Neri.

// 156
// 00:22:20.841 --> 00:22:26.388
// -Do you know my lawyer Tom Hagen?
// -I remember Tom from the old days.

// 157
// 00:22:26.471 --> 00:22:28.056
// Rocco.

// 158
// 00:22:28.140 --> 00:22:32.102
// -What's this?
// -It's an orange from Miami.

// 159
// 00:22:32.186 --> 00:22:35.230
// Take care of Johnny's men.
// They look like they might be hungry.

// 160
// 00:22:35.314 --> 00:22:36.315
// Johnny?

// 161
// 00:22:39.443 --> 00:22:43.614
// Tom won't stay. He only handles
// specific areas of the business.

// 162
// 00:22:44.448 --> 00:22:46.575
// Sure, Mike.

// 163
// 00:22:50.537 --> 00:22:53.874
// -What are you drinking, Johnny?
// -Anisette.

// 164
// 00:22:59.254 --> 00:23:04.468
// -If you need anything, I'll be outside.
// -Just tell Rocco we're waiting, Tom.

// 165
// 00:23:09.556 --> 00:23:13.810
// -I just left Mr. Roth in Miami.
// -How is his health?

// 166
// 00:23:13.894 --> 00:23:15.812
// It's not good.

// 167
// 00:23:17.022 --> 00:23:19.525
// Can I do anything or send anything?

// 168
// 00:23:19.608 --> 00:23:24.488
// He appreciates your concern, Michael,
// and your respect.

// 169
// 00:23:24.780 --> 00:23:26.490
// That casino...

// 170
// 00:23:26.573 --> 00:23:31.245
// Registered owners. Jacob Lawrence,
// Allan Barclay. Beverly Hills attorneys.

// 171
// 00:23:31.995 --> 00:23:34.915
// The real owners are
// the old Lakeville Road group

// 172
// 00:23:34.998 --> 00:23:37.292
// and our friend in Miami.

// 173
// 00:23:37.668 --> 00:23:43.757
// Klingman runs it and owns a piece of
// it too, but I've been instructed to tell you

// 174
// 00:23:43.841 --> 00:23:47.886
// that if you move him out,
// our friend in Miami will go along.

// 175
// 00:23:50.180 --> 00:23:54.852
// It's very kind of him.
// Tell him it's greatly appreciated.

// 176
// 00:23:56.019 --> 00:23:59.898
// Hyman Roth always makes money
// for his partners.

// 177
// 00:24:01.441 --> 00:24:05.028
// One by one, our old friends are gone.

// 178
// 00:24:05.529 --> 00:24:08.866
// Death, natural or not,

// 179
// 00:24:08.949 --> 00:24:11.702
// prison, deported...

// 180
// 00:24:12.953 --> 00:24:18.208
// Only Hyman Roth is left, because he
// always made money for his partners.

// 181
// 00:24:20.127 --> 00:24:25.799
// I can't believe it! Out of 30 professional
// musicians there isn't one Italian!

// 182
// 00:24:25.883 --> 00:24:28.594
// Let's have a tarantella!

// 183
// 00:24:34.057 --> 00:24:36.351
// You! Up, up, up!

// 184
// 00:24:45.986 --> 00:24:47.487
// <i>Questa mano!</i>

// 185
// 00:24:48.697 --> 00:24:50.657
// <i>Questa mano!</i>

// 186
// 00:24:56.288 --> 00:24:59.416
// What the hell have we here?

// 187
// 00:25:10.385 --> 00:25:16.099
// -I'll see my sister alone.
// -It concerns me too. May I stay?

// 188
// 00:25:16.183 --> 00:25:20.354
// How are you, honey? You've met
// Merle, he was with me in Vegas.

// 189
// 00:25:20.437 --> 00:25:23.607
// -I saw him with you.
// -Could I have a drink?

// 190
// 00:25:28.195 --> 00:25:30.531
// Al, please get him a drink!

// 191
// 00:25:32.825 --> 00:25:36.620
// We're going to Europe. I'd like to book
// passage on The Queen.

// 192
// 00:25:36.703 --> 00:25:39.540
// Why don't you go to a travel agent?

// 193
// 00:25:39.623 --> 00:25:42.626
// We're getting married first.

// 194
// 00:25:50.342 --> 00:25:54.513
// The ink on your divorce isn't dry yet,
// and you're getting married?

// 195
// 00:25:56.640 --> 00:25:59.142
// You see your children on weekends.

// 196
// 00:25:59.476 --> 00:26:04.398
// Your oldest boy was picked up in Reno
// for a theft you don't even know about.

// 197
// 00:26:04.481 --> 00:26:07.860
// You fly around the world
// with men who use you!

// 198
// 00:26:07.943 --> 00:26:10.487
// -You're not my father!
// -So why come to me?

// 199
// 00:26:10.571 --> 00:26:11.989
// I need money.

// 200
// 00:26:25.419 --> 00:26:28.172
// Connie, Connie, Connie...

// 201
// 00:26:34.595 --> 00:26:37.181
// I want to be reasonable with you.

// 202
// 00:26:38.432 --> 00:26:41.185
// Why don't you stay with the family?

// 203
// 00:26:42.352 --> 00:26:44.980
// You can live on the estate
// with your kids.

// 204
// 00:26:45.063 --> 00:26:48.734
// You won't be deprived of anything.

// 205
// 00:26:53.197 --> 00:26:58.660
// I don't know this Merle. I don't know
// what he does or what he lives on.

// 206
// 00:27:00.204 --> 00:27:05.209
// Tell him marriage is out of the question
// and you don't want to see him anymore.

// 207
// 00:27:05.334 --> 00:27:07.503
// He'll understand, believe me.

// 208
// 00:27:15.552 --> 00:27:17.596
// Connie.

// 209
// 00:27:19.556 --> 00:27:23.227
// If you don't listen to me
// and marry this man,

// 210
// 00:27:28.106 --> 00:27:30.442
// you'll disappoint me.

// 211
// 00:28:02.015 --> 00:28:06.228
// <i>-Famiglia!
// -Cent' anni!</i>

// 212
// 00:28:06.937 --> 00:28:09.022
// What's "Chen dannay"?

// 213
// 00:28:09.106 --> 00:28:12.025
// "Cent' anni". It means 100 years.

// 214
// 00:28:12.109 --> 00:28:16.446
// It means we should all live happily
// for 100 years. The family.

// 215
// 00:28:16.530 --> 00:28:20.576
// -It would be true if my father were alive.
// -Connie.

// 216
// 00:28:20.659 --> 00:28:22.286
// Hey...

// 217
// 00:28:22.369 --> 00:28:26.165
// Merle, you've met my sister-in-law,
// Deanna.

// 218
// 00:28:26.248 --> 00:28:27.916
// -Fredo's wife.
// -My pleasure.

// 219
// 00:28:38.635 --> 00:28:42.472
// With all respect, I didn't
// come here to eat dinner!

// 220
// 00:28:43.223 --> 00:28:44.725
// I know, I know.

// 221
// 00:29:15.088 --> 00:29:20.177
// -I just want to dance!
// -You're falling all over the floor.

// 222
// 00:29:20.344 --> 00:29:24.097
// You're justjealous
// because he's a real man!

// 223
// 00:29:24.264 --> 00:29:28.977
// -I'm going to belt you right in the teeth.
// -You couldn't belt your mama!

// 224
// 00:29:30.854 --> 00:29:33.023
// These Dagos are crazy
// when it comes to their wives.

// 225
// 00:29:33.106 --> 00:29:38.028
// Michael says that if you can't
// take care of this, I have to.

// 226
// 00:29:38.195 --> 00:29:41.031
// -I think you'd better.
// -Never marry a Wop.

// 227
// 00:29:41.198 --> 00:29:46.703
// They treat their wives like shit!
// I didn't mean to say Wop. Don't!

// 228
// 00:29:47.704 --> 00:29:53.001
// What are you doing to me,
// you big slob? Help!

// 229
// 00:29:53.085 --> 00:29:54.294
// Fredo!

// 230
// 00:29:54.378 --> 00:29:59.216
// -I can't control her, Mikey.
// -You're my brother, don't apologize.

// 231
// 00:30:03.136 --> 00:30:07.224
// Clemenza promised the Rosato
// brothers three territories after he died.

// 232
// 00:30:07.307 --> 00:30:08.809
// You took over and didn't give it to them.

// 233
// 00:30:08.892 --> 00:30:10.143
// I welched.

// 234
// 00:30:10.227 --> 00:30:14.690
// Clemenza promised them lu cazzo.
// He promised them nothing.

// 235
// 00:30:15.232 --> 00:30:20.404
// -He hated them more than I do.
// -Frankie, they feel cheated.

// 236
// 00:30:21.238 --> 00:30:25.492
// You're sitting up in the Sierra Mountains
// and you're drinking...

// 237
// 00:30:25.576 --> 00:30:27.911
// -What's he drinking?
// -Champagne.

// 238
// 00:30:27.995 --> 00:30:33.041
// Champagne cocktails, and passing
// judgment on how I run my family.

// 239
// 00:30:35.294 --> 00:30:37.087
// Your family's still called Corleone.

// 240
// 00:30:38.255 --> 00:30:41.341
// And you'll run it like a Corleone.

// 241
// 00:30:41.758 --> 00:30:45.429
// My family doesn't eat here,
// doesn't eat in Las Vegas...

// 242
// 00:30:46.013 --> 00:30:47.598
// ...and doesn't eat in Miami...

// 243
// 00:30:48.140 --> 00:30:49.766
// ...with Hyman Roth!

// 244
// 00:30:56.106 --> 00:31:00.652
// You're a good old man and I like you.

// 245
// 00:31:00.736 --> 00:31:03.155
// You were loyal to my father for years.

// 246
// 00:31:04.781 --> 00:31:08.785
// The Rosato brothers
// are taking hostages.

// 247
// 00:31:10.037 --> 00:31:15.876
// They spit right in my face, all because
// they're backed up by that Jew in Miami.

// 248
// 00:31:15.959 --> 00:31:18.837
// I know. That's why
// I don't want them touched.

// 249
// 00:31:19.004 --> 00:31:22.758
// -Not touched?
// -No, I want you to be fair with them.

// 250
// 00:31:22.841 --> 00:31:27.888
// You want me to be fair with them?
// How can you be fair to animals?

// 251
// 00:31:28.055 --> 00:31:34.186
// Tom, listen. They recruit spics,
// they recruit niggers.

// 252
// 00:31:34.311 --> 00:31:38.065
// They do violence in their grandmothers'
// neighborhoods!

// 253
// 00:31:38.148 --> 00:31:44.655
// And everything with them is whores!
// Andjunk, dope!

// 254
// 00:31:44.738 --> 00:31:47.366
// And they leave the gambling to last.

// 255
// 00:31:47.491 --> 00:31:52.704
// I want to run my family without you
// on my back. I want those Rosatos dead!

// 256
// 00:31:52.788 --> 00:31:55.624
// <i>-No.
// -Morte.</i>

// 257
// 00:32:01.129 --> 00:32:05.968
// I have business that's important with
// Hyman Roth. I don't want it disturbed.

// 258
// 00:32:07.845 --> 00:32:12.140
// Then you give your loyalty to a Jew
// before your own blood.

// 259
// 00:32:15.060 --> 00:32:19.189
// You know my father did business
// with Hyman Roth. He respected him.

// 260
// 00:32:19.398 --> 00:32:24.069
// Your father did business with
// Hyman Roth, he respected Hyman Roth,

// 261
// 00:32:24.236 --> 00:32:27.406
// but he never trusted Hyman Roth

// 262
// 00:32:27.531 --> 00:32:31.034
// or his Sicilian messenger boy,
// Johnny Ola.

// 263
// 00:32:31.326 --> 00:32:36.665
// You'll have to excuse me. I'm tired,
// and I'm a little drunk!

// 264
// 00:32:38.667 --> 00:32:43.797
// I want everybody here to know, there's
// not going to be no trouble from me!

// 265
// 00:32:44.256 --> 00:32:46.091
// Don Corleone.

// 266
// 00:32:46.300 --> 00:32:48.260
// Cicci, the door...

// 267
// 00:32:56.768 --> 00:32:58.854
// You want him to leave now?

// 268
// 00:33:01.398 --> 00:33:05.903
// Let him go back to New York.
// I've already made my plans.

// 269
// 00:33:06.904 --> 00:33:09.573
// The old man had too much wine.

// 270
// 00:33:13.785 --> 00:33:16.079
// It's late.

// 271
// 00:33:27.674 --> 00:33:29.760
// How's the baby?

// 272
// 00:33:29.843 --> 00:33:34.223
// -Sleeping inside me.
// -Does it feel like a boy?

// 273
// 00:33:34.306 --> 00:33:37.476
// Yes, it does, Michael.

// 274
// 00:33:39.853 --> 00:33:41.522
// Kay?

// 275
// 00:33:41.605 --> 00:33:46.193
// I'm sorry about all the people today.
// Bad timing.

// 276
// 00:33:46.276 --> 00:33:48.654
// It couldn't be helped, though.

// 277
// 00:33:48.737 --> 00:33:51.949
// It made me think
// of what you once told me.

// 278
// 00:33:53.992 --> 00:33:58.038
// " In five years the Corleone family
// will be completely legitimate. "

// 279
// 00:33:58.121 --> 00:34:01.041
// That was seven years ago.

// 280
// 00:34:03.627 --> 00:34:07.297
// I know. I'm trying, darling.

// 281
// 00:35:11.278 --> 00:35:14.031
// Did you see this?

// 282
// 00:35:27.711 --> 00:35:29.755
// Why are the drapes open?

// 283
// 00:35:57.491 --> 00:35:59.326
// Kay, are you all right?

// 284
// 00:35:59.409 --> 00:36:02.079
// -Are you hit?
// -No.

// 285
// 00:36:04.414 --> 00:36:06.708
// It's all right.

// 286
// 00:36:08.210 --> 00:36:10.504
// Stop! Stop!

// 287
// 00:36:12.130 --> 00:36:13.799
// Halt!

// 288
// 00:36:24.768 --> 00:36:28.564
// They're still on the property.
// Please stay inside.

// 289
// 00:36:28.647 --> 00:36:30.816
// -Keep them alive.
// -We'll try.

// 290
// 00:36:30.899 --> 00:36:32.442
// Alive!

// 291
// 00:36:33.569 --> 00:36:35.654
// Stay by the door.

// 292
// 00:37:55.025 --> 00:37:57.069
// Yeah, come in.

// 293
// 00:38:04.201 --> 00:38:07.037
// -Mike, are you all right?
// -Yeah.

// 294
// 00:38:11.333 --> 00:38:14.169
// There's a lot I can't tell you, Tom.

// 295
// 00:38:15.879 --> 00:38:19.299
// And I know that's upset you in the past.

// 296
// 00:38:20.425 --> 00:38:24.596
// You felt it was because of
// some lack of trust or confidence.

// 297
// 00:38:25.806 --> 00:38:30.686
// But it's because I admire you
// and love you

// 298
// 00:38:30.769 --> 00:38:33.605
// that I kept things secret from you.

// 299
// 00:38:35.315 --> 00:38:38.235
// Now you're the only one I can trust.

// 300
// 00:38:41.071 --> 00:38:42.948
// Fredo?

// 301
// 00:38:43.031 --> 00:38:45.576
// Well, he's got a good heart.

// 302
// 00:38:45.659 --> 00:38:50.247
// But he's weak and he's stupid,
// and this is life and death.

// 303
// 00:38:51.081 --> 00:38:54.293
// Tom, you're my brother.

// 304
// 00:38:59.882 --> 00:39:05.179
// I always wanted to be thought of as
// a brother by you, Mikey. A real brother.

// 305
// 00:39:07.556 --> 00:39:09.641
// I know that.

// 306
// 00:39:15.939 --> 00:39:18.025
// You're going to take over.

// 307
// 00:39:19.067 --> 00:39:21.320
// You're going to be the Don.

// 308
// 00:39:24.239 --> 00:39:29.745
// If what I think has happened,
// has happened, I'm leaving here tonight.

// 309
// 00:39:30.579 --> 00:39:36.668
// I give you complete power. Over Fredo
// and his men. Rocco, Neri, everyone.

// 310
// 00:39:38.420 --> 00:39:42.049
// I'm trusting you
// with the lives of my wife

// 311
// 00:39:42.132 --> 00:39:45.135
// and my children,
// the future of this family.

// 312
// 00:39:48.639 --> 00:39:53.477
// -If we catch them, will we find out...
// -We won't catch them.

// 313
// 00:39:55.646 --> 00:39:58.982
// Unless I'm very wrong,
// they're dead already.

// 314
// 00:40:00.484 --> 00:40:03.779
// They were killed by somebody
// close to us.

// 315
// 00:40:03.946 --> 00:40:08.492
// Inside. Very, very frightened
// that they botched it.

// 316
// 00:40:08.867 --> 00:40:13.163
// You don't think that Rocco and Neri
// had something to do with this?

// 317
// 00:40:16.333 --> 00:40:20.712
// See... All our people are businessmen.

// 318
// 00:40:22.381 --> 00:40:25.509
// Their loyalty is based on that.

// 319
// 00:40:27.845 --> 00:40:30.514
// One thing I learned from Pop

// 320
// 00:40:31.807 --> 00:40:35.352
// was to try to think
// as people around you think.

// 321
// 00:40:37.396 --> 00:40:40.315
// On that basis, anything is possible.

// 322
// 00:40:42.234 --> 00:40:46.029
// Mike, they're dead!
// Right outside my window!

// 323
// 00:40:46.196 --> 00:40:49.366
// I want to get out of here.
// They're lying there dead!

// 324
// 00:41:00.460 --> 00:41:03.213
// Over here! There's two of them.

// 325
// 00:41:03.380 --> 00:41:07.551
// Looks like they were hired
// out of New York. I don't recognize them.

// 326
// 00:41:07.968 --> 00:41:10.971
// Won't get anything out of them now.

// 327
// 00:41:11.054 --> 00:41:13.223
// Fish them out.

// 328
// 00:41:37.748 --> 00:41:40.042
// Get rid of the bodies.

// 329
// 00:41:40.125 --> 00:41:43.086
// -Where's Mike?
// -Rocco.

// 330
// 00:42:13.242 --> 00:42:18.580
// Anthony, everything is going to be
// all right. Try to sleep.

// 331
// 00:42:34.638 --> 00:42:39.268
// -Did you like your party?
// -I got lots of presents.

// 332
// 00:42:39.434 --> 00:42:42.771
// I know. Did you like them?

// 333
// 00:42:42.938 --> 00:42:46.233
// Yeah. I didn't know the people
// who gave them to me.

// 334
// 00:42:46.733 --> 00:42:49.570
// Well, they were friends.

// 335
// 00:42:51.321 --> 00:42:55.826
// -Did you see my present for you?
// -It was on my pillow.

// 336
// 00:42:58.328 --> 00:43:01.498
// I'm going to be leaving
// very early tomorrow.

// 337
// 00:43:02.332 --> 00:43:06.670
// -Will you take me?
// -No, I can't, Anthony.

// 338
// 00:43:06.837 --> 00:43:11.675
// -Why do you have to go?
// -I have to do business.

// 339
// 00:43:12.342 --> 00:43:15.470
// I could help you.

// 340
// 00:43:17.806 --> 00:43:20.934
// I know. Some day you will.

// 341
// 00:43:22.186 --> 00:43:24.313
// Get some sleep.

// 342
// 00:44:40.722 --> 00:44:43.892
// She's really beautiful.
// You've got to see her.

// 343
// 00:45:04.371 --> 00:45:08.750
// Wait till you see her.
// Words can't describe her.

// 344
// 00:45:18.302 --> 00:45:22.014
// I left Naples. I left Mama.

// 345
// 00:45:23.348 --> 00:45:25.184
// For a no-good tramp!

// 346
// 00:45:27.144 --> 00:45:31.523
// Now here I am in America,
// in New York.

// 347
// 00:45:33.734 --> 00:45:36.987
// Alone! Thinking of my mother.

// 348
// 00:45:39.364 --> 00:45:41.158
// Without news from home.

// 349
// 00:45:50.209 --> 00:45:52.169
// Finally, a letter from Naples!

// 350
// 00:45:55.214 --> 00:45:58.050
// Vito, how do you like my little angel?
// Isn't she beautiful?

// 351
// 00:45:59.009 --> 00:46:00.928
// She's very beautiful.

// 352
// 00:46:02.846 --> 00:46:06.433
// To you, she's beautiful. For me,
// there's only my wife and son.

// 353
// 00:46:07.476 --> 00:46:09.019
// Our dear mother -

// 354
// 00:46:11.313 --> 00:46:13.357
// ...is dead!

// 355
// 00:47:09.997 --> 00:47:12.916
// We'll go backstage later
// and take her to eat.

// 356
// 00:47:17.337 --> 00:47:19.339
// Sit down, you bum!

// 357
// 00:47:26.096 --> 00:47:28.098
// Oh, excuse me, Don Fanucci.

// 358
// 00:47:36.064 --> 00:47:38.275
// We'll go see her backstage.

// 359
// 00:47:41.195 --> 00:47:42.821
// Who was that?

// 360
// 00:47:43.780 --> 00:47:45.365
// The Black Hand.

// 361
// 00:48:17.981 --> 00:48:20.359
// That's Fanucci...the Black Hand.

// 362
// 00:48:20.859 --> 00:48:22.820
// We'll talk about it tomorrow.

// 363
// 00:48:24.112 --> 00:48:27.032
// Tomorrow! Always tomorrow!

// 364
// 00:48:28.116 --> 00:48:29.701
// You'll pay me today!

// 365
// 00:48:40.003 --> 00:48:41.672
// Let's go.

// 366
// 00:48:44.967 --> 00:48:47.094
// Not my daughter! Let her go!

// 367
// 00:48:48.554 --> 00:48:50.681
// Here, take all my money!

// 368
// 00:48:59.022 --> 00:49:01.358
// Vito, come on.

// 369
// 00:49:07.781 --> 00:49:11.076
// I know what you're thinking. But
// you don't know how things are.

// 370
// 00:49:11.702 --> 00:49:15.080
// Fanucci's with the Black Hand.
// The whole neighborhood pays him.

// 371
// 00:49:15.747 --> 00:49:17.541
// Even my father, in the grocery store.

// 372
// 00:49:17.875 --> 00:49:19.042
// If he's Italian...

// 373
// 00:49:21.086 --> 00:49:23.547
// ...why does he bother other Italians?

// 374
// 00:49:23.630 --> 00:49:26.049
// He knows they have nobody
// to protect them.

// 375
// 00:49:26.592 --> 00:49:28.302
// Forget that. Did you like my angel?

// 376
// 00:49:28.468 --> 00:49:30.262
// If you're happy, I'm happy.

// 377
// 00:50:18.519 --> 00:50:20.354
// Don't you feel well?

// 378
// 00:50:24.441 --> 00:50:26.235
// Is your boss treating you all right?

// 379
// 00:50:28.278 --> 00:50:29.988
// Forget it.

// 380
// 00:50:42.918 --> 00:50:45.921
// Hey, you speak Italian?

// 381
// 00:50:51.510 --> 00:50:53.011
// Hide this for me!

// 382
// 00:50:53.595 --> 00:50:55.681
// Next week I'll come and get it!

// 383
// 00:51:35.512 --> 00:51:37.681
// Abbandando, meet my nephew!

// 384
// 00:51:42.728 --> 00:51:44.688
// How's business?

// 385
// 00:51:50.944 --> 00:51:52.905
// It's good, it's good.

// 386
// 00:51:59.703 --> 00:52:02.956
// Fanucci's mad. Says the
// neighborhood's getting sloppy.

// 387
// 00:52:03.248 --> 00:52:07.127
// People don't pay on time,
// don't pay the full amount.

// 388
// 00:52:07.377 --> 00:52:09.546
// Says he's been too nice to everyone.

// 389
// 00:52:15.719 --> 00:52:17.679
// So Fanucci's changing?

// 390
// 00:52:18.138 --> 00:52:20.557
// Sure. He wants double
// from everybody.

// 391
// 00:52:21.683 --> 00:52:23.727
// Even from my father.

// 392
// 00:52:24.269 --> 00:52:27.815
// I'm a friend, right? So you'll
// let him work here?

// 393
// 00:53:00.264 --> 00:53:02.182
// I've got some bad news.

// 394
// 00:53:06.687 --> 00:53:08.939
// I feel rotten about telling you this...

// 395
// 00:53:11.900 --> 00:53:15.779
// But Fanucci...he's got a nephew...

// 396
// 00:53:23.537 --> 00:53:25.414
// And you have to give him my job.

// 397
// 00:53:26.373 --> 00:53:29.668
// You've always been good to me,
// ever since I came here.

// 398
// 00:53:30.878 --> 00:53:33.005
// You looked after me like a father.

// 399
// 00:53:33.463 --> 00:53:34.882
// I thank you.

// 400
// 00:53:36.383 --> 00:53:38.468
// And I won't forget it.

// 401
// 00:53:51.899 --> 00:53:53.817
// Vito!

// 402
// 00:53:58.113 --> 00:53:59.740
// Oh, no!

// 403
// 00:54:01.158 --> 00:54:03.202
// Take this to your family.

// 404
// 00:54:05.496 --> 00:54:07.915
// Thanks anyway. But please,
// I can't accept.

// 405
// 00:54:43.325 --> 00:54:45.077
// What a nice pear!

// 406
// 00:55:08.475 --> 00:55:11.103
// I'm Clemenza, you still
// have my goods?

// 407
// 00:55:14.189 --> 00:55:16.233
// Did you look inside?

// 408
// 00:55:17.985 --> 00:55:20.612
// I'm not interested in things
// that don't concern me.

// 409
// 00:55:31.999 --> 00:55:36.253
// A friend of mine has a nice rug.
// Maybe your wife would like it.

// 410
// 00:55:43.343 --> 00:55:46.805
// Sure she would. But who has
// money for a rug?

// 411
// 00:55:47.598 --> 00:55:52.352
// It would be a present.
// I know how to return a favor.

// 412
// 00:56:00.652 --> 00:56:02.529
// Yeah, sure.

// 413
// 00:56:02.613 --> 00:56:04.615
// My wife would like it.

// 414
// 00:56:29.056 --> 00:56:31.558
// That son of a bitch! He isn't home!

// 415
// 00:56:35.270 --> 00:56:37.439
// Damn, he didn't even leave the key.

// 416
// 00:56:42.152 --> 00:56:44.196
// Well, he won't mind.

// 417
// 00:56:55.499 --> 00:56:56.875
// Come on in.

// 418
// 00:56:57.918 --> 00:57:01.088
// Hey, Vito, come on in!

// 419
// 00:57:23.110 --> 00:57:25.028
// This is your friend's place?

// 420
// 00:57:27.739 --> 00:57:29.700
// This is a real palace.

// 421
// 00:57:30.200 --> 00:57:31.910
// One of the best.

// 422
// 00:57:38.500 --> 00:57:40.544
// Vito, give me a hand, will you?

// 423
// 00:59:37.119 --> 00:59:40.038
// Look how pretty it is, Santino!

// 424
// 01:02:08.479 --> 01:02:09.980
// Come on in.

// 425
// 01:02:12.483 --> 01:02:15.360
// It's all right. Hyman's in there.

// 426
// 01:02:15.444 --> 01:02:20.324
// -Would you like a tuna sandwich?
// -No, thank you.

// 427
// 01:02:26.872 --> 01:02:30.375
// <i>...pick up of two by Holden.
// Second and eight for S.C...</i>

// 428
// 01:02:31.543 --> 01:02:35.214
// -Mr. Roth?
// -Come in, Michael.

// 429
// 01:02:37.132 --> 01:02:39.718
// Sit down, make yourself comfortable.

// 430
// 01:02:41.553 --> 01:02:43.639
// It's almost over.

// 431
// 01:02:45.432 --> 01:02:50.270
// -Do you follow the football game?
// -Not for a while I haven't.

// 432
// 01:02:50.813 --> 01:02:53.941
// I enjoy watching football
// in the afternoon.

// 433
// 01:02:54.024 --> 01:02:59.112
// One of the things I love
// about this country. Baseball too.

// 434
// 01:03:01.198 --> 01:03:06.453
// Ever since Arnold Rothstein
// fixed the World Series in 1919.

// 435
// 01:03:11.041 --> 01:03:13.377
// I heard you had some trouble.

// 436
// 01:03:16.129 --> 01:03:17.923
// Stupid.

// 437
// 01:03:19.007 --> 01:03:22.052
// People behaving like that with guns.

// 438
// 01:03:23.929 --> 01:03:26.723
// The important thing is you're all right.

// 439
// 01:03:26.807 --> 01:03:29.935
// Good health is the most important thing.

// 440
// 01:03:30.894 --> 01:03:33.814
// More than success, more than money.

// 441
// 01:03:35.357 --> 01:03:37.025
// More than power.

// 442
// 01:03:51.540 --> 01:03:55.377
// I came here because
// there's going to be more bloodshed.

// 443
// 01:03:55.544 --> 01:03:59.548
// I wanted you to know,
// so another war won't start.

// 444
// 01:04:00.757 --> 01:04:03.719
// Nobody wants another war.

// 445
// 01:04:03.802 --> 01:04:09.641
// Frank Pentangeli asked my permission
// to get rid of the Rosato brothers.

// 446
// 01:04:09.725 --> 01:04:13.520
// When I refused he tried to have me
// killed. He was stupid, I was lucky.

// 447
// 01:04:13.604 --> 01:04:15.606
// I'll visit him soon.

// 448
// 01:04:15.731 --> 01:04:20.527
// The important thing is that nothing
// interferes with our plans for the future.

// 449
// 01:04:21.612 --> 01:04:24.114
// Nothing is more important.

// 450
// 01:04:25.949 --> 01:04:31.079
// -You're a wise and considerate man.
// -And you're a great man, Mr. Roth.

// 451
// 01:04:31.997 --> 01:04:37.002
// -There's much I can learn from you.
// -Whatever I can do to help, Michael.

// 452
// 01:04:39.213 --> 01:04:41.924
// -Excuse me. Lunch.
// -Come in.

// 453
// 01:04:42.049 --> 01:04:46.845
// -Thank you, my dear.
// -You're going to break your eardrums.

// 454
// 01:04:47.888 --> 01:04:50.349
// -Enjoy it.
// -Thank you.

// 455
// 01:04:55.979 --> 01:04:58.732
// You're young, I'm old and sick.

// 456
// 01:04:59.817 --> 01:05:03.821
// What we'll do in the next few months
// will make history.

// 457
// 01:05:05.989 --> 01:05:07.991
// It's never been done before.

// 458
// 01:05:08.075 --> 01:05:12.746
// Not even your father would dream
// that such a thing could be possible.

// 459
// 01:05:14.706 --> 01:05:19.294
// Frank Pentangeli is a dead man.
// You don't object?

// 460
// 01:05:20.671 --> 01:05:23.674
// He's small potatoes.

// 461
// 01:05:33.392 --> 01:05:35.853
// What's up?

// 462
// 01:05:38.230 --> 01:05:40.607
// We got company?

// 463
// 01:05:54.413 --> 01:05:55.706
// What's going on?

// 464
// 01:05:55.873 --> 01:05:57.875
// Michael Corleone is here.

// 465
// 01:06:00.294 --> 01:06:01.295
// Where is he?

// 466
// 01:06:01.378 --> 01:06:03.213
// He's in your den. You better hurry.

// 467
// 01:06:04.006 --> 01:06:05.966
// He's been waiting a half hour.

// 468
// 01:06:13.182 --> 01:06:15.350
// Is something wrong?

// 469
// 01:06:21.190 --> 01:06:23.233
// I wish you would have let me know
// you were coming.

// 470
// 01:06:23.317 --> 01:06:27.237
// -I could have prepared something.
// -I didn't want you to know.

// 471
// 01:06:34.912 --> 01:06:38.832
// -You heard what happened?
// -I almost died. We were so relieved...

// 472
// 01:06:38.957 --> 01:06:41.084
// In my home!

// 473
// 01:06:43.921 --> 01:06:47.007
// In my bedroom where my wife sleeps!

// 474
// 01:06:49.801 --> 01:06:52.137
// Where my children come to play.

// 475
// 01:06:53.806 --> 01:06:55.849
// In my home.

// 476
// 01:07:12.908 --> 01:07:15.828
// I want you to help me take my revenge.

// 477
// 01:07:15.911 --> 01:07:19.581
// Michael, anything. What can I do?

// 478
// 01:07:22.793 --> 01:07:26.046
// Settle these troubles
// with the Rosato brothers.

// 479
// 01:07:26.129 --> 01:07:28.715
// I don't understand. I don't...

// 480
// 01:07:28.799 --> 01:07:33.804
// I don't have your brain for big deals.
// But this is a street thing.

// 481
// 01:07:33.887 --> 01:07:38.684
// That Hyman Roth in Miami.
// He's backing up those sons-of-bitches.

// 482
// 01:07:38.767 --> 01:07:43.564
// -I know he is.
// -So why ask me to lay down to them?

// 483
// 01:07:49.653 --> 01:07:52.781
// It was Hyman Roth
// that tried to have me killed.

// 484
// 01:07:54.533 --> 01:07:57.077
// I know it was him.

// 485
// 01:07:58.078 --> 01:08:00.205
// Jesus Christ, Mike.

// 486
// 01:08:00.289 --> 01:08:05.085
// Jesus Christ, let's get them all.
// Now while we've got the muscle.

// 487
// 01:08:10.174 --> 01:08:13.051
// This used to be my father's old study.

// 488
// 01:08:14.219 --> 01:08:16.513
// It's changed.

// 489
// 01:08:17.514 --> 01:08:21.685
// I remember there used to be
// a big desk here.

// 490
// 01:08:24.855 --> 01:08:30.068
// I remember when I was a kid. We had
// to be quiet when we played near here.

// 491
// 01:08:37.868 --> 01:08:41.371
// I was very happy that this house
// never went to strangers.

// 492
// 01:08:42.748 --> 01:08:46.460
// First Clemenza took it over. Now you.

// 493
// 01:08:48.378 --> 01:08:52.799
// My father taught me many things here.
// He taught me in this room.

// 494
// 01:08:57.137 --> 01:09:03.227
// He taught me, "Keep your friends close,
// but your enemies closer. "

// 495
// 01:09:03.310 --> 01:09:09.483
// If Hyman Roth sees that I interceded
// in this, in the Rosato brothers' favor,

// 496
// 01:09:09.566 --> 01:09:13.028
// he'll think his relationship with me
// is still good.

// 497
// 01:09:15.906 --> 01:09:18.283
// That's what I want him to think.

// 498
// 01:09:19.201 --> 01:09:23.121
// I want him relaxed and confident
// in our friendship.

// 499
// 01:09:23.747 --> 01:09:27.751
// Then I'll be able to find out
// who the traitor in my family was.

// 500
// 01:09:55.279 --> 01:09:58.740
// <i>-Yeah?
// -Fredo, this is Johnny Ola.</i>

// 501
// 01:09:59.491 --> 01:10:03.287
// <i>-We need some more help.
// -Johnny?</i>

// 502
// 01:10:04.413 --> 01:10:07.249
// Jesus Christ, what the hell time is it?

// 503
// 01:10:07.332 --> 01:10:10.127
// <i>-Who's that, honey?
// -Listen good, Fredo.</i>

// 504
// 01:10:10.294 --> 01:10:13.505
// Why are you calling me?
// I don't want to talk to you.

// 505
// 01:10:13.672 --> 01:10:17.050
// <i>Pentangeli is going to accept
// the Rosato brothers' deal.</i>

// 506
// 01:10:17.217 --> 01:10:19.303
// <i>-Oh, God.
// -Will he come alone?</i>

// 507
// 01:10:19.469 --> 01:10:22.639
// I don't know. You've got me in
// deep enough already.

// 508
// 01:10:22.806 --> 01:10:27.978
// <i>Everything will be all right. Pentangeli
// says he's willing to make a deal.</i>

// 509
// 01:10:28.145 --> 01:10:32.566
// <i>All we want to know is if he's on
// the level, or if he'll bring his boys.</i>

// 510
// 01:10:32.733 --> 01:10:35.861
// You lied to me. I don't want you
// to call me anymore.

// 511
// 01:10:36.028 --> 01:10:40.908
// <i>-Your brother won't find out we talked.
// -I don't know what you're talking about.</i>

// 512
// 01:10:51.460 --> 01:10:55.339
// -Who was that?
// -Wrong number.

// 513
// 01:11:02.513 --> 01:11:06.725
// -Frankie, I've got nobody here.
// -Wait in the car, Cicc'.

// 514
// 01:11:06.809 --> 01:11:09.520
// -Frankie.
// -That's okay, Cicc'.

// 515
// 01:11:16.527 --> 01:11:20.823
// -What's this?
// -A lucky C note for our new deal.

// 516
// 01:11:23.492 --> 01:11:26.328
// Ritchie. Give us a taste.

// 517
// 01:11:31.124 --> 01:11:34.503
// We were all real happy
// about your decision, Frankie.

// 518
// 01:11:34.586 --> 01:11:38.882
// -You won't regret it.
// -I don't like the C note, Rosato.

// 519
// 01:11:38.966 --> 01:11:41.635
// I take that as an insult.

// 520
// 01:11:41.718 --> 01:11:44.721
// Michael Corleone says hello!

// 521
// 01:12:01.905 --> 01:12:04.241
// Close the door!

// 522
// 01:12:04.324 --> 01:12:06.368
// Your friend the cop...

// 523
// 01:12:06.451 --> 01:12:11.039
// Hey, Ritch. It's dark in here.
// Are you open or closed?

// 524
// 01:12:11.123 --> 01:12:14.960
// I just came in to clean up a little,
// you know?

// 525
// 01:12:17.337 --> 01:12:19.381
// What's the matter?

// 526
// 01:12:19.464 --> 01:12:22.551
// -Is that something on the floor?
// -Carmine, not here!

// 527
// 01:12:22.634 --> 01:12:24.136
// Anthony!

// 528
// 01:12:27.389 --> 01:12:31.101
// You open this bar
// and I'll blow your head in!

// 529
// 01:13:16.814 --> 01:13:19.274
// Freddy, it's good to see you.

// 530
// 01:13:21.652 --> 01:13:26.448
// -How is he?
// -He's okay. He's in the back.

// 531
// 01:13:30.160 --> 01:13:32.663
// Girls, take a hike.

// 532
// 01:13:35.582 --> 01:13:37.835
// In this room here.

// 533
// 01:13:40.546 --> 01:13:44.216
// -I want to talk to him alone first.
// -Come on.

// 534
// 01:13:52.933 --> 01:13:55.686
// I thought I could help you, Senator.

// 535
// 01:13:59.523 --> 01:14:01.358
// Hagen?

// 536
// 01:14:02.484 --> 01:14:06.697
// -Listen, I did not...
// -It's all right.

// 537
// 01:14:06.864 --> 01:14:11.618
// -I didn't do anything.
// -It's okay. You're very lucky.

// 538
// 01:14:12.411 --> 01:14:17.082
// My brother Fredo operates this place.
// He was called before anyone.

// 539
// 01:14:18.375 --> 01:14:22.212
// Had this happened some place else,
// we couldn't have helped you.

// 540
// 01:14:25.090 --> 01:14:28.468
// When I woke up, I was on the floor.

// 541
// 01:14:29.386 --> 01:14:33.807
// -And I don't know how it happened.
// -You can't remember?

// 542
// 01:14:37.060 --> 01:14:39.229
// I passed out.

// 543
// 01:14:55.329 --> 01:14:58.457
// Just a game. Jesus.

// 544
// 01:15:09.092 --> 01:15:11.470
// Jesus, Jesus!

// 545
// 01:15:16.016 --> 01:15:18.185
// Jesus God!

// 546
// 01:15:18.268 --> 01:15:19.895
// God!

// 547
// 01:15:22.898 --> 01:15:26.527
// I don't know, and I don't understand
// why I can't remember.

// 548
// 01:15:26.610 --> 01:15:29.822
// Doesn't matter, just do as I say.

// 549
// 01:15:29.905 --> 01:15:35.410
// Put in a call to your office.
// Explain that you'll be there tomorrow.

// 550
// 01:15:36.453 --> 01:15:41.166
// You decided to spend the night at
// Michael Corleone's house in Tahoe.

// 551
// 01:15:41.291 --> 01:15:45.879
// -As his guest.
// -I do remember that she was laughing.

// 552
// 01:15:48.131 --> 01:15:53.637
// We'd done it before, and I know
// that I could not have hurt that girl.

// 553
// 01:15:54.471 --> 01:15:58.559
// This girl has no family.
// Nobody knows that she worked here.

// 554
// 01:15:58.642 --> 01:16:01.645
// It'll be as though she never existed.

// 555
// 01:16:03.981 --> 01:16:06.942
// All that's left is our friendship.

// 556
// 01:16:21.999 --> 01:16:25.210
// -Yes?
// -Sorry, but we're not to let you through.

// 557
// 01:16:26.503 --> 01:16:30.591
// -I'm just going to the market.
// -We'll pick up anything you want.

// 558
// 01:16:30.674 --> 01:16:33.760
// -Whose orders are these?
// -Mr. Hagen's. He's coming.

// 559
// 01:16:33.844 --> 01:16:36.305
// I'll speak to him.

// 560
// 01:16:42.102 --> 01:16:45.689
// I wanted to explain,
// but I had business in Carson City.

// 561
// 01:16:45.856 --> 01:16:50.194
// It's Michael's request for your safety.
// We'll get anything you need.

// 562
// 01:16:50.319 --> 01:16:55.616
// -So I'm supposed to stay in my house?
// -No, within the compound will be fine.

// 563
// 01:16:55.699 --> 01:16:58.660
// -We were going to New England.
// -That's off.

// 564
// 01:16:59.620 --> 01:17:02.623
// -Am I a prisoner?
// -That's not how we see it, Kay.

// 565
// 01:17:03.582 --> 01:17:06.835
// Come on, kids.
// We're going back to the house.

// 566
// 01:17:08.295 --> 01:17:10.214
// Joe.

// 567
// 01:17:55.926 --> 01:17:57.719
// Cuba, Cuba!

// 568
// 01:18:38.802 --> 01:18:41.847
// Most respected gentlemen.

// 569
// 01:18:41.930 --> 01:18:44.141
// Welcome to Havana.

// 570
// 01:18:46.226 --> 01:18:51.440
// I want to thank this distinguished group
// of American industrialists

// 571
// 01:18:53.150 --> 01:18:56.111
// for continuing to work with Cuba

// 572
// 01:18:56.820 --> 01:18:59.990
// for the greatest period of prosperity

// 573
// 01:19:00.866 --> 01:19:03.660
// in her entire history.

// 574
// 01:19:04.036 --> 01:19:06.079
// Mr. William Shaw,

// 575
// 01:19:06.163 --> 01:19:08.999
// representing
// the General Fruit Company.

// 576
// 01:19:09.917 --> 01:19:12.002
// Messrs. Corngold and Dant,

// 577
// 01:19:12.878 --> 01:19:15.839
// of United Telephone
// and Telegraph Company.

// 578
// 01:19:17.174 --> 01:19:18.634
// Mr. Petty,

// 579
// 01:19:18.717 --> 01:19:22.679
// Regional Vice President of
// the Pan American Mining Corporation.

// 580
// 01:19:24.515 --> 01:19:27.351
// Mr. Robert Allen
// of South American Sugar.

// 581
// 01:19:29.228 --> 01:19:31.563
// Mr. Michael Corleone of Nevada,

// 582
// 01:19:33.190 --> 01:19:37.736
// representing our associates
// in tourism and leisure activities.

// 583
// 01:19:37.820 --> 01:19:41.448
// And my old friend and associate
// from Florida,

// 584
// 01:19:43.075 --> 01:19:44.910
// Mr. Hyman Roth.

// 585
// 01:19:45.202 --> 01:19:50.374
// I would like to thank United Telephone
// and Telegraph for their Christmas gift.

// 586
// 01:19:55.629 --> 01:19:57.881
// A solid gold telephone.

// 587
// 01:20:00.259 --> 01:20:03.762
// Perhaps you gentlemen
// would like to look at it.

// 588
// 01:20:04.555 --> 01:20:06.390
// -Mr. President?
// -Yes?

// 589
// 01:20:06.473 --> 01:20:12.146
// Could you discuss the rebel activity and
// what this can mean to our businesses?

// 590
// 01:20:12.604 --> 01:20:13.856
// -Of course.
// -Heavy stuff.

// 591
// 01:20:13.939 --> 01:20:19.611
// I assure you that, although the rebels
// have started a campaign in Las Villas,

// 592
// 01:20:26.285 --> 01:20:32.040
// my staff indicates, with assurance,
// that we'll drive them out of Santa Clara

// 593
// 01:20:32.124 --> 01:20:34.168
// before the New Year.

// 594
// 01:20:35.961 --> 01:20:37.963
// I want to put you all at ease.

// 595
// 01:20:38.839 --> 01:20:43.051
// We will tolerate no guerrillas
// in the casinos or the swimming pools.

// 596
// 01:21:01.278 --> 01:21:03.530
// He said that they're making an arrest,

// 597
// 01:21:03.614 --> 01:21:06.366
// and in a few minutes
// he'll let us through.

// 598
// 01:21:06.450 --> 01:21:07.534
// Johnny...

// 599
// 01:21:07.618 --> 01:21:08.660
// It's nothing.

// 600
// 01:21:09.453 --> 01:21:12.122
// Just some lousy bandits.
// The police are cleaning them up.

// 601
// 01:21:15.292 --> 01:21:16.668
// <i>Viva Fidel!</i>

// 602
// 01:21:32.392 --> 01:21:37.356
// I hope my age is correct.
// I'm always accurate about my age.

// 603
// 01:21:38.524 --> 01:21:42.361
// Make sure that everybody
// sees the cake before we cut it.

// 604
// 01:21:45.405 --> 01:21:48.033
// I'm very pleased

// 605
// 01:21:48.116 --> 01:21:52.746
// you're all able to come from
// such distances to be with me today.

// 606
// 01:21:54.289 --> 01:21:57.167
// When a man comes
// to this point in his life,

// 607
// 01:21:58.544 --> 01:22:01.922
// he wants to turn over
// the things he's been blessed with.

// 608
// 01:22:02.005 --> 01:22:07.136
// Turn them over to friends,
// as a reward for the friends he's had

// 609
// 01:22:08.387 --> 01:22:13.642
// and to make sure that everything
// goes well after he's gone.

// 610
// 01:22:13.725 --> 01:22:16.395
// -Not for years.
// -Hear, hear!

// 611
// 01:22:16.520 --> 01:22:20.691
// We'll see. The doctors would disagree,
// but what do they know?

// 612
// 01:22:22.025 --> 01:22:26.947
// These are wonderful things
// that we've achieved in Havana

// 613
// 01:22:27.030 --> 01:22:30.117
// and there's no limit
// to where we can go from here.

// 614
// 01:22:30.200 --> 01:22:34.955
// This kind of government knows
// how to help business, to encourage it.

// 615
// 01:22:35.038 --> 01:22:39.084
// The hotels here are bigger
// and swankier

// 616
// 01:22:39.168 --> 01:22:41.545
// than any of the joints in Vegas.

// 617
// 01:22:42.171 --> 01:22:45.132
// We can thank our friends
// in the Cuban government

// 618
// 01:22:45.215 --> 01:22:49.970
// which has put up half the cash with the
// Teamsters, on a dollar for dollar basis

// 619
// 01:22:50.053 --> 01:22:52.890
// and has relaxed restrictions on imports.

// 620
// 01:22:52.973 --> 01:22:57.436
// What I'm saying is that we have now
// what we have always needed...

// 621
// 01:22:57.519 --> 01:23:00.314
// Real partnership with a government.

// 622
// 01:23:00.397 --> 01:23:02.399
// Smaller piece.

// 623
// 01:23:03.192 --> 01:23:08.030
// You all know Michael Corleone
// and we all remember his father.

// 624
// 01:23:08.113 --> 01:23:11.825
// At the time of my retirement, or death,

// 625
// 01:23:11.909 --> 01:23:17.831
// I turn over all my interests
// in the Havana operation to his control.

// 626
// 01:23:17.915 --> 01:23:21.752
// But, all of you will share.

// 627
// 01:23:21.835 --> 01:23:25.714
// The Nacionale will go
// to the Lakeville Road Boys,

// 628
// 01:23:25.797 --> 01:23:29.176
// the Capri to the Corleone family,

// 629
// 01:23:29.259 --> 01:23:31.678
// the Sevilla Biltmore also,

// 630
// 01:23:31.762 --> 01:23:35.349
// but Eddie Levine will bring in the
// Pennino brothers,

// 631
// 01:23:35.432 --> 01:23:37.684
// Dino and Eddie, for a piece

// 632
// 01:23:37.768 --> 01:23:40.521
// and to handle the casino operations.

// 633
// 01:23:40.604 --> 01:23:44.066
// We've saved a piece
// for some friends in Nevada

// 634
// 01:23:44.149 --> 01:23:47.903
// to make sure that things go smoothly
// back home.

// 635
// 01:23:50.113 --> 01:23:55.035
// I want all of you to enjoy your cake.
// So, enjoy!

// 636
// 01:23:55.118 --> 01:23:57.579
// <i>-Happy birthday!
// -L'chaim!</i>

// 637
// 01:23:58.789 --> 01:24:01.542
// I saw an interesting thing happen today.

// 638
// 01:24:02.835 --> 01:24:06.004
// A rebel was being arrested
// by the military police.

// 639
// 01:24:06.129 --> 01:24:10.551
// Rather than be taken alive, he exploded
// a grenade he had in his jacket.

// 640
// 01:24:10.634 --> 01:24:14.221
// He killed himself and took a captain
// of the command with him.

// 641
// 01:24:14.304 --> 01:24:18.142
// -Those rebels are lunatics.
// -Maybe so.

// 642
// 01:24:19.810 --> 01:24:24.731
// But it occurred to me, that the soldiers
// are paid to fight, the rebels aren't.

// 643
// 01:24:24.815 --> 01:24:28.610
// -What does that tell you?
// -They can win.

// 644
// 01:24:30.946 --> 01:24:34.658
// This country has had rebels
// for 50 years. It's in their blood.

// 645
// 01:24:34.741 --> 01:24:38.537
// I know, I've been coming here
// since the Twenties.

// 646
// 01:24:38.620 --> 01:24:42.416
// We were running molasses
// from Havana when you were a baby.

// 647
// 01:24:42.499 --> 01:24:45.085
// The trucks were owned by your father.

// 648
// 01:24:46.170 --> 01:24:47.796
// Michael.

// 649
// 01:24:54.845 --> 01:24:59.016
// I'd rather we talked about this
// when we're alone.

// 650
// 01:25:00.684 --> 01:25:03.770
// The two million never got to the island.

// 651
// 01:25:09.359 --> 01:25:12.529
// It mustn't be known
// that you held back the money

// 652
// 01:25:12.613 --> 01:25:15.115
// because you worried about the rebels.

// 653
// 01:25:21.872 --> 01:25:25.209
// Sit down, Michael. Sit down.

// 654
// 01:25:32.800 --> 01:25:36.678
// If I could only live to see it,
// to be there with you.

// 655
// 01:25:39.181 --> 01:25:43.393
// What I wouldn't give for 20 more years.

// 656
// 01:25:45.229 --> 01:25:49.483
// Here we are, protected. Free to make
// our profits without Kefauver,

// 657
// 01:25:49.566 --> 01:25:53.320
// the goddamn Justice Department
// and the FBI.

// 658
// 01:25:54.029 --> 01:25:57.574
// 90 miles away, in partnership
// with a friendly government.

// 659
// 01:25:58.742 --> 01:26:02.204
// 90 miles. It's nothing.

// 660
// 01:26:03.330 --> 01:26:08.418
// Just one small step for a man looking
// to be President of the United States

// 661
// 01:26:09.169 --> 01:26:12.089
// and having the cash
// to make it possible.

// 662
// 01:26:12.506 --> 01:26:14.049
// Michael,

// 663
// 01:26:15.926 --> 01:26:18.345
// we're bigger than U.S. Steel.

// 664
// 01:26:45.122 --> 01:26:48.125
// Mikey, how are you? Okay?

// 665
// 01:26:49.418 --> 01:26:54.131
// <i>-Hi! Freddy Corleone.
// -Mio frati.</i>

// 666
// 01:26:55.382 --> 01:26:57.426
// Jesus Christ, what a trip!

// 667
// 01:26:57.885 --> 01:27:01.138
// I thought, "What if somebody knows
// what I've got in here".

// 668
// 01:27:01.555 --> 01:27:06.059
// Can you imagine that? Two million
// dollars on the seat next to me.

// 669
// 01:27:09.938 --> 01:27:12.107
// -Excuse me.
// -It's okay.

// 670
// 01:27:14.151 --> 01:27:15.944
// You want to count it?

// 671
// 01:27:19.990 --> 01:27:23.952
// What's going on? I'm totally in the dark.

// 672
// 01:27:24.077 --> 01:27:28.832
// The family is making an investment in
// Havana. This is a gift for the President.

// 673
// 01:27:29.791 --> 01:27:33.337
// That's great! Havana's great.

// 674
// 01:27:34.880 --> 01:27:37.007
// It's my kind of town.

// 675
// 01:27:38.300 --> 01:27:43.055
// -Anybody I know in Havana?
// -Don't know. Hyman Roth, Johnny Ola?

// 676
// 01:27:45.974 --> 01:27:48.644
// No. I've never met them.

// 677
// 01:27:52.231 --> 01:27:56.276
// Listen, Mikey, I'm kind of...

// 678
// 01:28:00.322 --> 01:28:04.701
// Kind of nervous from the trip.
// Can I get a drink or something?

// 679
// 01:28:05.369 --> 01:28:08.038
// I thought maybe we'd go out together.

// 680
// 01:28:08.789 --> 01:28:12.251
// I know a place where
// we can spend some time together.

// 681
// 01:28:14.294 --> 01:28:18.882
// Sometimes I think I should have
// married a woman like you did. Like Kay.

// 682
// 01:28:19.925 --> 01:28:22.803
// Have kids. Have a family.

// 683
// 01:28:25.013 --> 01:28:28.892
// For once in my life, be more like

// 684
// 01:28:29.726 --> 01:28:31.436
// Pop.

// 685
// 01:28:33.772 --> 01:28:38.360
// It's not easy to be a son, Fredo.
// It's not easy.

// 686
// 01:28:38.527 --> 01:28:41.655
// Mama used to say,
// "You don't belong to me. "

// 687
// 01:28:41.738 --> 01:28:45.284
// "You were left on the doorstep
// by gypsies. "

// 688
// 01:28:45.367 --> 01:28:47.494
// Sometimes I think it's true.

// 689
// 01:28:48.412 --> 01:28:50.581
// You're no gypsy, Fredo.

// 690
// 01:28:51.915 --> 01:28:55.752
// Mikey, I was mad at you.

// 691
// 01:29:03.427 --> 01:29:07.014
// Why didn't we spend time
// like this before?

// 692
// 01:29:07.181 --> 01:29:09.766
// You want a drink, right? Waiter!

// 693
// 01:29:13.896 --> 01:29:16.023
// <i>Por favor...</i>

// 694
// 01:29:17.399 --> 01:29:20.277
// -How do you say Banana Daiquiri?
// -Banana Daiquiri.

// 695
// 01:29:20.444 --> 01:29:22.738
// -That's it?
// -That's it.

// 696
// 01:29:22.821 --> 01:29:24.907
// Uno Banana Daiquiri

// 697
// 01:29:25.532 --> 01:29:28.202
// and a club soda.

// 698
// 01:29:35.959 --> 01:29:38.712
// Senator Geary flies in from Washington
// tomorrow

// 699
// 01:29:38.795 --> 01:29:41.340
// with some government people.

// 700
// 01:29:41.423 --> 01:29:45.093
// I want you to show them
// a good time in Havana.

// 701
// 01:29:46.970 --> 01:29:51.099
// -That's my specialty, right?
// -Can I trust you with something?

// 702
// 01:29:51.809 --> 01:29:54.311
// Of course, Mike.

// 703
// 01:29:56.480 --> 01:30:00.234
// Later in the evening we're all invited
// to the Presidential Palace

// 704
// 01:30:00.317 --> 01:30:02.069
// to bring in the New Year.

// 705
// 01:30:02.528 --> 01:30:08.242
// After it's over they'll take me home
// in a military car, alone.

// 706
// 01:30:08.325 --> 01:30:10.077
// For my protection.

// 707
// 01:30:11.078 --> 01:30:14.706
// Before I reach my hotel,
// I'll be assassinated.

// 708
// 01:30:32.766 --> 01:30:35.644
// -Who?
// -Roth.

// 709
// 01:30:41.525 --> 01:30:44.361
// It was Roth who tried to kill me
// in my home.

// 710
// 01:30:46.280 --> 01:30:48.615
// It was Roth all along.

// 711
// 01:30:48.699 --> 01:30:52.703
// He acts like I'm his son, his successor.

// 712
// 01:30:53.745 --> 01:30:56.915
// But he thinks he'll live forever
// and wants me out.

// 713
// 01:31:01.795 --> 01:31:06.425
// -How can I help?
// -Just go along, as if you know nothing.

// 714
// 01:31:06.508 --> 01:31:09.219
// -I've already made my move.
// -What move?

// 715
// 01:31:10.512 --> 01:31:12.890
// Hyman Roth won't see the New Year.

// 716
// 01:31:30.407 --> 01:31:34.328
// You're to take it easy,
// he'll be back tomorrow.

// 717
// 01:31:34.411 --> 01:31:36.788
// Fly in my own doctor from Miami.

// 718
// 01:31:36.872 --> 01:31:39.291
// I don't trust a doctor
// who can't speak English.

// 719
// 01:31:40.792 --> 01:31:43.670
// <i>-Gracias, señor.
// -Buenas noches.</i>

// 720
// 01:31:45.506 --> 01:31:49.218
// -Honey, go to the casino.
// -If you're feeling better.

// 721
// 01:31:49.384 --> 01:31:51.053
// Feel fine.

// 722
// 01:31:52.888 --> 01:31:57.059
// -Play the bingo game.
// -Okay. Nice to see you, Mr. Paul.

// 723
// 01:31:59.561 --> 01:32:04.566
// My sixth sense tells me Fredo brought
// a bag full of money. Where is it?

// 724
// 01:32:07.027 --> 01:32:13.617
// -You're pulling out?
// -Just want to... Just want to wait.

// 725
// 01:32:17.204 --> 01:32:20.707
// -How do you feel?
// -Terrible.

// 726
// 01:32:20.874 --> 01:32:24.461
// I'd give four million to be able to take
// a painless piss.

// 727
// 01:32:25.087 --> 01:32:30.843
// -Who had Frank Pentangeli killed?
// -The Rosato brothers.

// 728
// 01:32:31.009 --> 01:32:34.179
// I know, but who gave the go-ahead?

// 729
// 01:32:35.139 --> 01:32:36.723
// I know I didn't.

// 730
// 01:32:44.648 --> 01:32:49.736
// There was this kid I grew up with.
// He was younger than me.

// 731
// 01:32:49.820 --> 01:32:56.368
// Sort of looked up to me, you know.
// We did our first work together.

// 732
// 01:32:56.451 --> 01:33:00.289
// Worked our way out of the street.
// Things were good.

// 733
// 01:33:01.540 --> 01:33:06.170
// During Prohibition
// we ran molasses into Canada.

// 734
// 01:33:06.253 --> 01:33:09.339
// Made a fortune. Your father, too.

// 735
// 01:33:11.008 --> 01:33:17.014
// As much as anyone,
// I loved him and trusted him.

// 736
// 01:33:19.725 --> 01:33:25.647
// Later on he had an idea to build a city

// 737
// 01:33:25.731 --> 01:33:29.526
// out of a desert stop-over
// for G. I.s going to the West Coast.

// 738
// 01:33:31.403 --> 01:33:35.157
// That kid's name was Moe Greene

// 739
// 01:33:35.240 --> 01:33:38.911
// and the city he invented was Las Vegas.

// 740
// 01:33:40.329 --> 01:33:42.789
// This was a great man.

// 741
// 01:33:42.873 --> 01:33:45.292
// A man of vision and guts.

// 742
// 01:33:45.417 --> 01:33:51.632
// And there isn't even a plaque,
// signpost or statue of him in that town.

// 743
// 01:33:53.634 --> 01:33:57.262
// Someone put a bullet through his eye.

// 744
// 01:33:58.472 --> 01:34:00.808
// No one knows who gave the order.

// 745
// 01:34:01.809 --> 01:34:05.103
// When I heard it, I wasn't angry.

// 746
// 01:34:05.229 --> 01:34:11.151
// I knew Moe, I knew he was headstrong.
// Talking loud, saying stupid things.

// 747
// 01:34:11.235 --> 01:34:16.073
// So when he turned up dead, I let it go.

// 748
// 01:34:17.825 --> 01:34:20.994
// And I said to myself,

// 749
// 01:34:21.078 --> 01:34:25.082
// "This is the business we've chosen. "

// 750
// 01:34:25.165 --> 01:34:27.417
// I didn't ask

// 751
// 01:34:27.960 --> 01:34:33.173
// who gave the order, because it had
// nothing to do with business.

// 752
// 01:34:41.723 --> 01:34:46.228
// That two million in a bag in your room...

// 753
// 01:34:48.480 --> 01:34:52.151
// I'm going in to take a nap.

// 754
// 01:34:52.776 --> 01:34:58.073
// When I wake, if the money
// is on the table, I know I have a partner.

// 755
// 01:34:58.657 --> 01:35:01.785
// If it isn't, I know I don't.

// 756
// 01:35:56.799 --> 01:36:00.969
// Does everybody know everybody?
// You know Senator Geary.

// 757
// 01:36:01.136 --> 01:36:04.306
// Good to see you, Mike.
// I'm glad we spend this time together.

// 758
// 01:36:04.389 --> 01:36:07.351
// Senator Payton from Florida...

// 759
// 01:36:07.643 --> 01:36:10.813
// Judge DeMalco from New York...

// 760
// 01:36:10.979 --> 01:36:13.816
// Senator Ream from Maryland...

// 761
// 01:36:13.941 --> 01:36:16.443
// Fred Corngold from UTT.

// 762
// 01:36:16.527 --> 01:36:20.447
// -That Fred does a mean cha-cha-cha!
// -He does?

// 763
// 01:36:20.531 --> 01:36:22.908
// Gentlemen, it's refill time!

// 764
// 01:36:22.991 --> 01:36:27.454
// You might try some of the local drinks.
// Cuba Libre, Piña Colada...

// 765
// 01:36:27.538 --> 01:36:31.416
// I think I'll try
// one of those redheaded Yolandas.

// 766
// 01:36:31.500 --> 01:36:34.336
// -That you got! Con gusto...
// -Johnny!

// 767
// 01:36:35.504 --> 01:36:39.091
// You don't know my brother Fredo.
// Johnny Ola, Fredo.

// 768
// 01:36:39.258 --> 01:36:42.886
// -We never met. Johnny Ola.
// -Pleasure.

// 769
// 01:36:44.096 --> 01:36:46.557
// Gentlemen, to a night in Havana!

// 770
// 01:36:46.723 --> 01:36:48.350
// -Happy New Year!
// -Happy New Year!

// 771
// 01:36:48.517 --> 01:36:51.436
// <i>-Feliz Año Nuevo!
// -Happy New Year.</i>

// 772
// 01:37:03.115 --> 01:37:07.244
// -Hey, Freddy, why are we standing?
// -Everybody stands.

// 773
// 01:37:07.411 --> 01:37:11.999
// -It's worth it. You won't believe this.
// -I don't believe it already.

// 774
// 01:37:12.082 --> 01:37:15.252
// -50 dollars, right?
// -You've got a bet, mister.

// 775
// 01:37:23.427 --> 01:37:24.928
// That's Superman.

// 776
// 01:37:58.921 --> 01:38:01.173
// Did I tell you or did I tell you?

// 777
// 01:38:02.883 --> 01:38:05.511
// -I don't believe it!
// -It's got to be fake.

// 778
// 01:38:05.677 --> 01:38:08.972
// It's real. That's why
// he's called Superman.

// 779
// 01:38:09.473 --> 01:38:13.519
// Hey, Freddy, where did you find
// this place?

// 780
// 01:38:13.602 --> 01:38:18.023
// Johnny Ola brought me here. I didn't
// believe it, but seeing is believing!

// 781
// 01:38:18.106 --> 01:38:21.568
// -I see it, but still don't believe it!
// -50 bucks, Pat.

// 782
// 01:38:21.652 --> 01:38:25.239
// Roth won't go here,
// but Johnny knows these places!

// 783
// 01:38:26.156 --> 01:38:31.119
// -Watch, he'll break a cracker with it.
// -I want to see him break a brick!

// 784
// 01:39:53.076 --> 01:39:56.455
// Relax, we're taking you to the hospital.

// 785
// 01:40:45.587 --> 01:40:48.006
// ...and you'll continue to get those.

// 786
// 01:40:48.173 --> 01:40:52.594
// I don't believe that President
// Eisenhower would ever pull out of Cuba

// 787
// 01:40:52.678 --> 01:40:56.390
// as we have over one billion dollars
// invested in this country.

// 788
// 01:40:59.893 --> 01:41:03.188
// The American public
// believe in non-intervention...

// 789
// 01:41:03.272 --> 01:41:06.191
// Fredo! Where are you going?

// 790
// 01:41:06.275 --> 01:41:09.903
// I'm getting a real drink,
// because I can't...

// 791
// 01:42:05.459 --> 01:42:09.004
// What kept Mr. Roth?
// I understood he was coming.

// 792
// 01:42:09.087 --> 01:42:12.633
// Reeves, what's the protocol?
// How long should we stay?

// 793
// 01:42:14.051 --> 01:42:18.972
// I think a half hour ought to do it. Just
// long enough to bring in the New Year.

// 794
// 01:42:34.404 --> 01:42:37.741
// It's New Year's Eve. Come on,
// just for a minute.

// 795
// 01:43:52.649 --> 01:43:56.820
// There's a plane waiting to take us
// to Miami in an hour.

// 796
// 01:43:56.987 --> 01:43:59.615
// Don't make a big thing about it.

// 797
// 01:44:02.993 --> 01:44:06.830
// I know it was you, Fredo.
// You broke my heart.

// 798
// 01:44:08.332 --> 01:44:10.125
// You broke my heart!

// 799
// 01:44:50.332 --> 01:44:54.878
// Due to serious setbacks to our
// troops in Guantanamo and Santiago...

// 800
// 01:44:55.796 --> 01:44:58.132
// ...my position in Cuba is untenable.

// 801
// 01:45:00.509 --> 01:45:04.680
// I am resigning from office
// to avoid further bloodshed.

// 802
// 01:45:05.389 --> 01:45:08.559
// And I shall leave the city immediately.

// 803
// 01:45:12.813 --> 01:45:15.816
// I wish all of you good luck.

// 804
// 01:45:23.198 --> 01:45:26.243
// <i>Salud!</i>

// 805
// 01:45:27.452 --> 01:45:30.873
// <i>Viva la revolución! Viva Fidel!</i>

// 806
// 01:45:52.728 --> 01:45:54.271
// Fredo!

// 807
// 01:45:54.938 --> 01:45:58.901
// Come on. Come with me.
// It's the only way out of here tonight.

// 808
// 01:45:59.485 --> 01:46:01.445
// Roth is dead.

// 809
// 01:46:02.237 --> 01:46:06.450
// Fredo, come with me!
// You're still my brother.

// 810
// 01:46:07.576 --> 01:46:09.077
// Fredo!

// 811
// 01:46:33.685 --> 01:46:36.522
// I'm Pat Geary, United States Senator.

// 812
// 01:47:07.553 --> 01:47:09.513
// Fidel! Fidel! Fidel!

// 813
// 01:47:49.803 --> 01:47:53.390
// Al. Get me a wet towel.

// 814
// 01:47:59.855 --> 01:48:02.733
// Does Kay know I'm back?

// 815
// 01:48:06.820 --> 01:48:09.907
// My boy? Did you get him
// something for Christmas?

// 816
// 01:48:09.990 --> 01:48:13.410
// -I took care of it.
// -What was it, so I'll know.

// 817
// 01:48:13.577 --> 01:48:18.624
// It was a little car with an electric motor
// that he can ride in. It's nice.

// 818
// 01:48:21.126 --> 01:48:23.253
// Thank you, Al.

// 819
// 01:48:24.338 --> 01:48:27.883
// Fellows, could you step outside
// for a minute?

// 820
// 01:48:44.942 --> 01:48:46.693
// Where's my brother?

// 821
// 01:48:47.611 --> 01:48:50.823
// Roth got out on a private boat.
// He's in a hospital in Miami.

// 822
// 01:48:50.906 --> 01:48:55.577
// He had a stroke, but recovered okay.
// Your bodyguard is dead.

// 823
// 01:48:55.661 --> 01:48:57.579
// I asked about Fredo.

// 824
// 01:48:58.580 --> 01:49:01.959
// I think he got out.
// He must be somewhere in New York.

// 825
// 01:49:04.962 --> 01:49:06.380
// All right.

// 826
// 01:49:07.631 --> 01:49:10.425
// I want you to get in touch with him.

// 827
// 01:49:10.509 --> 01:49:13.345
// I know he's scared.
// Tell him everything is all right.

// 828
// 01:49:13.470 --> 01:49:18.809
// Tell him I know Roth misled him. That
// he didn't know they would try to kill me.

// 829
// 01:49:19.726 --> 01:49:23.981
// -They can come in now.
// -There was something else.

// 830
// 01:49:24.982 --> 01:49:26.483
// What?

// 831
// 01:49:33.490 --> 01:49:35.284
// What? Come on.

// 832
// 01:49:37.327 --> 01:49:39.621
// Kay had a miscarriage.

// 833
// 01:49:52.551 --> 01:49:54.928
// -Was it a boy?
// -At three and a half months...

// 834
// 01:49:55.012 --> 01:49:57.931
// Can't you give me a straight answer?
// Was it a boy?

// 835
// 01:50:02.060 --> 01:50:04.646
// I really don't know.

// 836
// 01:50:19.870 --> 01:50:22.873
// Poor little Fredo, he's got pneumonia.

// 837
// 01:51:08.252 --> 01:51:11.964
// Young man, I hear you and
// your friends are stealing goods.

// 838
// 01:51:12.297 --> 01:51:16.093
// But you don't even send a
// dress to my house. No respect!

// 839
// 01:51:16.677 --> 01:51:18.720
// You know I've got three daughters.

// 840
// 01:51:19.221 --> 01:51:20.848
// This is my neighborhood.

// 841
// 01:51:21.723 --> 01:51:25.102
// You and your friends should
// show me some respect.

// 842
// 01:51:26.228 --> 01:51:29.940
// You should let me wet
// my beak a little.

// 843
// 01:51:32.276 --> 01:51:35.946
// I hear you and your friends
// cleared $600 each.

// 844
// 01:51:36.613 --> 01:51:41.118
// Give me $200 each, for your own
// protection. And I'll forget the insult.

// 845
// 01:51:41.493 --> 01:51:46.582
// You young punks have to learn
// to respect a man like me!

// 846
// 01:51:48.876 --> 01:51:51.295
// Otherwise the cops will
// come to your house.

// 847
// 01:51:51.753 --> 01:51:54.298
// And your family will be ruined.

// 848
// 01:51:55.466 --> 01:52:00.804
// Of course if I'm wrong about how much
// you stole - I'll take a little less.

// 849
// 01:52:01.472 --> 01:52:05.476
// And by less, I only mean -
// a hundred bucks less.

// 850
// 01:52:05.809 --> 01:52:07.644
// Now don't refuse me.

// 851
// 01:52:09.605 --> 01:52:11.315
// Understand, paisan?

// 852
// 01:52:17.821 --> 01:52:19.281
// I understand.

// 853
// 01:52:21.700 --> 01:52:26.371
// My friends and I share all the money.
// So first, I have to talk to them.

// 854
// 01:52:27.790 --> 01:52:32.127
// Tell your friends I don't want a lot.
// Just enough to wet my beak.

// 855
// 01:52:36.340 --> 01:52:38.634
// Don't be afraid to tell them!

// 856
// 01:52:41.011 --> 01:52:42.805
// 600 bucks...

// 857
// 01:52:43.096 --> 01:52:45.349
// Suppose we don't pay?

// 858
// 01:52:46.517 --> 01:52:49.978
// You know his gang, Tessio.
// Real animals.

// 859
// 01:52:50.729 --> 01:52:54.149
// Maranzalla himself let Fanucci
// work this neighborhood.

// 860
// 01:52:55.025 --> 01:52:58.529
// He's got connections with the cops, too.
// We have to pay him.

// 861
// 01:52:59.238 --> 01:53:01.198
// $200 each...everybody agreed?

// 862
// 01:53:05.702 --> 01:53:07.204
// Why do we have to pay him?

// 863
// 01:53:07.830 --> 01:53:10.124
// Vito, leave this to us.

// 864
// 01:53:11.708 --> 01:53:14.211
// He's one person, we're three.

// 865
// 01:53:14.503 --> 01:53:17.172
// He's got guns, we've got guns.

// 866
// 01:53:17.714 --> 01:53:21.051
// Why should we give him the
// money we sweated for?

// 867
// 01:53:21.301 --> 01:53:23.512
// This is his neighborhood!

// 868
// 01:53:25.222 --> 01:53:29.726
// I know two bookies who don't give
// anything to Fanucci.

// 869
// 01:53:30.227 --> 01:53:31.770
// Who?

// 870
// 01:53:32.146 --> 01:53:36.150
// Joe The Greek and Frank Pignattaro.

// 871
// 01:53:36.233 --> 01:53:37.734
// They don't pay Fanucci.

// 872
// 01:53:39.528 --> 01:53:44.408
// If they don't pay Fanucci, then
// somebody else collects for Maranzalla!

// 873
// 01:53:45.576 --> 01:53:49.580
// We'll all be better off if we
// pay him. Don't worry.

// 874
// 01:54:05.095 --> 01:54:07.931
// Now what I say stays in this room.

// 875
// 01:54:08.140 --> 01:54:12.978
// If you both like, why not give me
// $50 each to pay Fanucci?

// 876
// 01:54:16.148 --> 01:54:19.485
// I guarantee he'll accept
// what I give him.

// 877
// 01:54:22.112 --> 01:54:24.448
// If Fanucci says $200...

// 878
// 01:54:24.531 --> 01:54:25.949
// ...he means it, Vito!

// 879
// 01:54:26.450 --> 01:54:29.411
// I'll reason with him.

// 880
// 01:54:31.538 --> 01:54:33.540
// Leave everything to me.

// 881
// 01:54:34.166 --> 01:54:36.251
// I'll take care of everything.

// 882
// 01:54:37.920 --> 01:54:40.464
// I never lie to my friends.

// 883
// 01:54:41.298 --> 01:54:44.218
// Tomorrow you both go talk to Fanucci.

// 884
// 01:54:45.260 --> 01:54:47.095
// He'll ask for the money.

// 885
// 01:54:48.013 --> 01:54:52.643
// Tell him you'll pay whatever
// he wants. Don't argue with him.

// 886
// 01:54:53.811 --> 01:54:56.480
// Then I'll go and get him to agree.

// 887
// 01:54:58.690 --> 01:55:01.485
// Don't argue with him, since
// he's so tough.

// 888
// 01:55:02.277 --> 01:55:04.822
// How can you get him to take less?

// 889
// 01:55:05.572 --> 01:55:07.699
// That's my business.

// 890
// 01:55:08.033 --> 01:55:11.411
// Just remember that I did you a favor.

// 891
// 01:55:15.833 --> 01:55:17.417
// Is it a deal?

// 892
// 01:55:18.502 --> 01:55:19.503
// Yes.

// 893
// 01:56:07.384 --> 01:56:09.761
// His family's out of the house.

// 894
// 01:56:10.137 --> 01:56:12.431
// Fanucci's alone in the cafe.

// 895
// 01:56:17.352 --> 01:56:21.064
// <i>Vito, here's my 50 dollars.
// Buona fortuna.</i>

// 896
// 01:56:32.117 --> 01:56:34.703
// Are you sure he's going to go for it?

// 897
// 01:56:38.123 --> 01:56:42.419
// I'll make an offer he don't refuse.
// Don't worry.

// 898
// 01:57:15.452 --> 01:57:20.165
// It looks like there's -
// $ 100 under my hat.

// 899
// 01:57:32.010 --> 01:57:34.221
// I was right.

// 900
// 01:57:35.639 --> 01:57:37.432
// Only $ 100...

// 901
// 01:57:40.811 --> 01:57:43.063
// I'm short of money right now.

// 902
// 01:57:44.940 --> 01:57:49.528
// I've been out of work...so just
// give me a little time.

// 903
// 01:57:50.404 --> 01:57:52.614
// You understand, don't you?

// 904
// 01:58:00.831 --> 01:58:03.459
// You've got balls, young man!

// 905
// 01:58:05.461 --> 01:58:08.505
// How come I never heard
// of you before?

// 906
// 01:58:15.012 --> 01:58:17.431
// You've got a lot of guts.

// 907
// 01:58:21.393 --> 01:58:24.354
// I'll find you some work
// for good money.

// 908
// 01:58:35.741 --> 01:58:39.995
// No hard feelings, right? If I can
// help you, let me know.

// 909
// 01:58:42.790 --> 01:58:45.209
// You've done well for yourself.

// 910
// 01:58:49.129 --> 01:58:51.215
// Enjoy the festa!

// 911
// 02:01:00.511 --> 02:01:02.846
// Oh, this is too violent for me!

// 912
// 02:03:24.863 --> 02:03:26.323
// What've you got there?

// 913
// 02:06:04.982 --> 02:06:08.944
// Michael, your father loves you
// very much.

// 914
// 02:09:34.024 --> 02:09:37.653
// <i>Mr. Cicci, from the year 1942
// to the present time,</i>

// 915
// 02:09:37.736 --> 02:09:41.240
// <i>you were an employee
// of the Genco Olive Oil Company?</i>

// 916
// 02:09:41.698 --> 02:09:43.325
// <i>That's right.</i>

// 917
// 02:09:44.201 --> 02:09:48.413
// <i>But in actuality you were a member
// of the Corleone crime organization.</i>

// 918
// 02:09:51.375 --> 02:09:55.212
// <i>No, we called it
// the Corleone family, Senator.</i>

// 919
// 02:09:55.587 --> 02:09:58.090
// <i>What was your position?</i>

// 920
// 02:09:59.007 --> 02:10:02.261
// <i>At first, like everybody else,
// I was a soldier.</i>

// 921
// 02:10:02.344 --> 02:10:05.264
// <i>-What is that?
// -A button, you know, Senator.</i>

// 922
// 02:10:05.347 --> 02:10:07.766
// <i>No, I don't know. Tell me.</i>

// 923
// 02:10:09.309 --> 02:10:14.898
// <i>When the boss says "push a button" on
// a guy, I push a button. See, Senator?</i>

// 924
// 02:10:14.982 --> 02:10:16.358
// <i>Mr. Questadt.</i>

// 925
// 02:10:16.900 --> 02:10:19.069
// <i>-You mean you kill people?
// -What?</i>

// 926
// 02:10:19.153 --> 02:10:24.283
// <i>You kill people at
// the behest of your superiors.</i>

// 927
// 02:10:28.078 --> 02:10:29.580
// <i>Yeah, that's right.</i>

// 928
// 02:10:29.663 --> 02:10:35.002
// <i>And the head of your family
// is Michael Corleone?</i>

// 929
// 02:10:35.085 --> 02:10:38.213
// <i>Yeah, Counselor. Michael Corleone.</i>

// 930
// 02:10:38.297 --> 02:10:42.134
// <i>Did you ever get such an order
// directly from Michael Corleone?</i>

// 931
// 02:10:42.926 --> 02:10:45.012
// <i>No, I never talked to him.</i>

// 932
// 02:10:45.095 --> 02:10:49.016
// <i>Mr. Cicci, could you amplify
// your answer a bit?</i>

// 933
// 02:10:49.099 --> 02:10:52.436
// <i>-Do what?
// -Could you expand on your answer?</i>

// 934
// 02:10:52.519 --> 02:10:58.317
// <i>I'm particularly interested in knowing,
// was there always a buffer involved?</i>

// 935
// 02:10:58.442 --> 02:11:02.988
// <i>Someone in between you
// and your superiors who gave the order.</i>

// 936
// 02:11:03.071 --> 02:11:07.534
// <i>Right, a buffer.
// The family had a lot of buffers!</i>

// 937
// 02:11:09.411 --> 02:11:13.582
// <i>You may find this very amusing, but
// the members of this committee do not.</i>

// 938
// 02:11:41.819 --> 02:11:43.987
// Tell me something, Ma.

// 939
// 02:11:48.117 --> 02:11:51.787
// What did Papa think...
// deep in his heart?

// 940
// 02:11:58.377 --> 02:12:00.254
// He was being strong...

// 941
// 02:12:06.718 --> 02:12:08.345
// Strong for his family.

// 942
// 02:12:18.147 --> 02:12:20.816
// But by being strong for his family...

// 943
// 02:12:22.317 --> 02:12:24.153
// ...could he...

// 944
// 02:12:26.071 --> 02:12:27.364
// ...lose it?

// 945
// 02:12:29.324 --> 02:12:34.705
// You're thinking about your wife...
// about the baby you lost.

// 946
// 02:12:36.540 --> 02:12:39.835
// But you and your wife can
// always have another baby.

// 947
// 02:12:41.545 --> 02:12:43.380
// No, I meant...lose his family

// 948
// 02:12:47.718 --> 02:12:51.221
// But you can never lose your family.

// 949
// 02:13:00.731 --> 02:13:02.566
// Times are changing.

// 950
// 02:13:25.088 --> 02:13:27.549
// It's my pleasure.
// I don't want money.

// 951
// 02:13:28.342 --> 02:13:30.052
// Take it as a gift.

// 952
// 02:13:32.971 --> 02:13:37.142
// If there's something I can do for you,
// you come, we talk.

// 953
// 02:13:53.784 --> 02:13:56.662
// Signora Colombo, why did you
// come to see me?

// 954
// 02:13:59.623 --> 02:14:03.127
// Your wife told me to ask
// if you could help me.

// 955
// 02:14:05.796 --> 02:14:07.798
// She's in bad trouble.

// 956
// 02:14:08.465 --> 02:14:12.469
// Her neighbors complained to the
// landlord about her dog.

// 957
// 02:14:13.929 --> 02:14:16.181
// He told her to get rid of the animal.

// 958
// 02:14:17.808 --> 02:14:21.979
// But her little boy loves that dog.
// So she hid it.

// 959
// 02:14:22.604 --> 02:14:26.400
// When the landlord found out, he
// got mad and told her to leave.

// 960
// 02:14:29.278 --> 02:14:32.114
// Now she can't stay even if she
// gets rid of it.

// 961
// 02:14:32.781 --> 02:14:34.450
// I'm so ashamed!

// 962
// 02:14:34.825 --> 02:14:39.288
// He said he'd get the police to
// throw us out on the street.

// 963
// 02:14:42.124 --> 02:14:43.709
// I'm sorry, but...

// 964
// 02:14:45.711 --> 02:14:49.173
// I could give you a couple dollars
// to help you move.

// 965
// 02:14:50.007 --> 02:14:51.467
// I can't move!

// 966
// 02:14:52.843 --> 02:14:54.761
// I want you to talk to him!

// 967
// 02:14:55.345 --> 02:14:58.015
// Tell him I want to stay here!

// 968
// 02:15:05.814 --> 02:15:07.399
// What's your landlord's name?

// 969
// 02:15:07.858 --> 02:15:09.902
// His name is Signor Roberto.

// 970
// 02:15:10.486 --> 02:15:12.905
// He lives on Fourth Street, near here.

// 971
// 02:15:13.530 --> 02:15:16.450
// They break the windows,
// they dirty the floors...

// 972
// 02:15:17.534 --> 02:15:19.077
// A real pig-sty, eh?

// 973
// 02:15:38.180 --> 02:15:42.142
// My name is Vito Corleone.
// Signora Colombo is a friend of my wife.

// 974
// 02:15:43.060 --> 02:15:46.355
// She says she's been evicted
// for no good reason.

// 975
// 02:15:46.897 --> 02:15:51.151
// She's a poor widow, she has nobody
// to take care of her.

// 976
// 02:15:51.401 --> 02:15:55.447
// She has no relatives, no money.
// All she has is this neighborhood.

// 977
// 02:15:55.823 --> 02:15:59.451
// I already rented the place
// to another family.

// 978
// 02:16:04.998 --> 02:16:09.628
// I told her that I'd talk to you.
// That you're a reasonable man.

// 979
// 02:16:10.879 --> 02:16:14.758
// She got rid of the animal that
// caused all the trouble.

// 980
// 02:16:15.300 --> 02:16:17.219
// So let her stay.

// 981
// 02:16:17.302 --> 02:16:18.929
// Impossible.

// 982
// 02:16:19.805 --> 02:16:21.140
// Are you Sicilian?

// 983
// 02:16:21.557 --> 02:16:23.225
// No, I'm Calabrese.

// 984
// 02:16:23.892 --> 02:16:27.187
// We're practically paisan,
// do me this favor.

// 985
// 02:16:27.771 --> 02:16:30.440
// I already rented it!
// I'll look like an idiot.

// 986
// 02:16:31.441 --> 02:16:33.735
// Besides, the new tenants
// pay more rent.

// 987
// 02:16:34.278 --> 02:16:36.697
// How much more a month?

// 988
// 02:16:37.823 --> 02:16:38.907
// Five bucks.

// 989
// 02:16:43.787 --> 02:16:46.832
// Here's six months increase in advance.

// 990
// 02:16:47.708 --> 02:16:50.794
// But don't tell her about it.
// She's very proud.

// 991
// 02:16:51.253 --> 02:16:53.839
// Come see me in another six months.

// 992
// 02:16:55.299 --> 02:16:58.302
// Of course, the dog stays. Right?

// 993
// 02:16:59.094 --> 02:17:00.220
// The dog stays.

// 994
// 02:17:04.808 --> 02:17:08.145
// Who the hell are you
// to come give me orders?

// 995
// 02:17:08.520 --> 02:17:12.566
// Watch out or I'll kick your Sicilian ass
// right into the street!

// 996
// 02:17:15.027 --> 02:17:16.779
// Do me this favor.

// 997
// 02:17:17.654 --> 02:17:19.740
// I won't forget it.

// 998
// 02:17:20.574 --> 02:17:23.869
// Ask your friends in the
// neighborhood about me.

// 999
// 02:17:24.995 --> 02:17:27.664
// They'll tell you I know how
// to return a favor.

// 1000
// 02:17:34.505 --> 02:17:36.423
// What a character!

// 1001
// 02:17:44.348 --> 02:17:49.269
// That landlord is here... Roberto,
// the one who owns those ratholes.

// 1002
// 02:17:56.860 --> 02:18:00.197
// He's been asking all around
// the neighborhood about you.

// 1003
// 02:18:08.205 --> 02:18:10.999
// I hope I'm not disturbing you,
// Don Vito.

// 1004
// 02:18:12.126 --> 02:18:14.378
// What can I do for you, Don Roberto?

// 1005
// 02:18:16.296 --> 02:18:18.340
// What a misunderstanding! Holy Mary!

// 1006
// 02:18:19.675 --> 02:18:22.594
// Of course Signora Colombo can stay!

// 1007
// 02:18:28.809 --> 02:18:31.728
// I'm giving back the money you gave me.

// 1008
// 02:18:33.438 --> 02:18:39.194
// Un, due, three, four, five, six, tutt'!

// 1009
// 02:18:40.070 --> 02:18:44.825
// Because after all, Don Vito,
// money isn't everything.

// 1010
// 02:18:53.417 --> 02:18:55.169
// Can I sit down?

// 1011
// 02:18:58.213 --> 02:19:01.216
// Your kindness to that widow
// made me ashamed of myself.

// 1012
// 02:19:02.259 --> 02:19:05.262
// The rent stays like before!

// 1013
// 02:19:14.855 --> 02:19:16.315
// I'll even lower it.

// 1014
// 02:19:19.151 --> 02:19:20.444
// I'll lower it $5.

// 1015
// 02:19:24.782 --> 02:19:26.325
// I'll lower it $ 10!

// 1016
// 02:19:32.790 --> 02:19:34.875
// Can I offer you some coffee?

// 1017
// 02:19:37.252 --> 02:19:41.882
// I'm late for an appointment! I can't
// this time! Ask me another time!

// 1018
// 02:19:47.304 --> 02:19:49.765
// You'll have to excuse me for now.

// 1019
// 02:19:55.145 --> 02:19:57.272
// I wish I could stay longer!

// 1020
// 02:20:03.237 --> 02:20:05.656
// Just call me and I'll be here!

// 1021
// 02:20:16.667 --> 02:20:19.503
// He won't be back. He'll hide out
// in the Bronx!

// 1022
// 02:20:35.185 --> 02:20:40.023
// -Vito, what do you think?
// -We'll make a big business!

// 1023
// 02:20:47.030 --> 02:20:50.200
// <i>-New York City.
// -Would you speak up, please?</i>

// 1024
// 02:20:50.909 --> 02:20:52.578
// <i>New York City.</i>

// 1025
// 02:20:52.661 --> 02:20:56.290
// <i>-Are you the son of Vito CorIeone?
// -Yes, I am.</i>

// 1026
// 02:20:56.373 --> 02:21:00.043
// <i>-Where was he born?
// -CorIeone, SiciIy.</i>

// 1027
// 02:21:00.210 --> 02:21:06.133
// <i>Did he at times use an aIias that was
// known in certain circIes as Godfather?</i>

// 1028
// 02:21:06.925 --> 02:21:13.098
// <i>Godfather is a term used by his friends.
// One of affection and respect.</i>

// 1029
// 02:21:13.932 --> 02:21:18.395
// <i>Mr. Chairman, I wouId Iike to verify
// the witness' statement.</i>

// 1030
// 02:21:18.479 --> 02:21:23.567
// <i>For years many of my constituents
// have been of ItaIian descent.</i>

// 1031
// 02:21:23.901 --> 02:21:26.320
// <i>I've come to know them weII.</i>

// 1032
// 02:21:26.445 --> 02:21:30.657
// <i>They have honored me
// with their support and their friendship.</i>

// 1033
// 02:21:30.783 --> 02:21:35.996
// <i>I can proudly say that some of my
// very best friends are ItaIian-Americans.</i>

// 1034
// 02:21:37.247 --> 02:21:42.252
// <i>However, Mr. Chairman, unfortunateIy
// I have to Ieave these proceedings</i>

// 1035
// 02:21:42.419 --> 02:21:46.632
// <i>in order to preside over a very important
// meeting of my own committee.</i>

// 1036
// 02:21:47.758 --> 02:21:50.761
// <i>Before I Ieave, I do want to say this,</i>

// 1037
// 02:21:50.844 --> 02:21:55.140
// <i>that these hearings on the Mafia
// are in no way whatsoever</i>

// 1038
// 02:21:55.224 --> 02:21:57.851
// <i>a sIur upon the great ItaIian peopIe.</i>

// 1039
// 02:21:57.935 --> 02:22:01.104
// <i>I can state from my own knowIedge
// and experience</i>

// 1040
// 02:22:01.188 --> 02:22:06.360
// <i>that ItaIian-Americans are among
// the most IoyaI, most Iaw-abiding,</i>

// 1041
// 02:22:06.443 --> 02:22:09.947
// <i>patriotic, hard-working
// American citizens in this Iand.</i>

// 1042
// 02:22:11.031 --> 02:22:16.036
// <i>It wouId be a shame, Mr. Chairman,
// if we aIIowed a few rotten appIes</i>

// 1043
// 02:22:16.120 --> 02:22:18.372
// <i>to give a bad name to the whoIe barreI.</i>

// 1044
// 02:22:18.455 --> 02:22:24.044
// <i>Because from the time of Christopher
// CoIumbus to the time of Enrico Fermi</i>

// 1045
// 02:22:24.128 --> 02:22:26.255
// <i>to the present day,</i>

// 1046
// 02:22:26.421 --> 02:22:30.676
// <i>ItaIian-Americans have been pioneers
// in buiIding and defending our nation.</i>

// 1047
// 02:22:31.135 --> 02:22:36.348
// <i>They are the saIt of the earth, and
// one of the backbones of this country.</i>

// 1048
// 02:22:42.437 --> 02:22:46.233
// <i>I'm sure we aII agree
// with our esteemed coIIeague.</i>

// 1049
// 02:22:46.316 --> 02:22:50.612
// <i>Mr. CorIeone, you have been advised
// as to your IegaI rights.</i>

// 1050
// 02:22:50.696 --> 02:22:56.160
// <i>We have testimony from
// a previous witness, one WiIIi Cicci.</i>

// 1051
// 02:22:57.161 --> 02:23:01.582
// <i>He stated that you are head of the most
// powerfuI Mafia famiIy in the country.</i>

// 1052
// 02:23:01.665 --> 02:23:03.959
// <i>-Are you?
// -No, I'm not.</i>

// 1053
// 02:23:04.042 --> 02:23:07.337
// <i>He testified that you are
// personaIIy responsibIe</i>

// 1054
// 02:23:07.421 --> 02:23:11.425
// <i>for the murder of a New York
// poIice captain in 1947</i>

// 1055
// 02:23:11.508 --> 02:23:15.095
// <i>and with him a man
// named VirgiI SoIIozzo.</i>

// 1056
// 02:23:15.262 --> 02:23:17.764
// <i>-Do you deny this?
// -Yes, I do.</i>

// 1057
// 02:23:17.931 --> 02:23:21.018
// <i>Is it true that in the year 1950</i>

// 1058
// 02:23:21.101 --> 02:23:26.482
// <i>you devised the murder of the heads
// of "the Five FamiIies" in New York</i>

// 1059
// 02:23:26.565 --> 02:23:30.152
// <i>to assume and consoIidate
// your nefarious power?</i>

// 1060
// 02:23:30.235 --> 02:23:33.572
// <i>-It's a compIete faIsehood.
// -Mr. Questadt.</i>

// 1061
// 02:23:33.697 --> 02:23:38.410
// <i>Is it true you have a controIIing interest
// in three major hoteIs in Las Vegas?</i>

// 1062
// 02:23:39.536 --> 02:23:44.708
// <i>No, it's not true. I own some stock in
// some of the hoteIs there, but very IittIe.</i>

// 1063
// 02:23:47.336 --> 02:23:51.590
// <i>I aIso have stock in IBM and IT&T.</i>

// 1064
// 02:23:52.674 --> 02:23:58.931
// <i>Do you have any controI over gambIing
// and narcotics in New York State?</i>

// 1065
// 02:23:59.014 --> 02:24:00.557
// <i>No, I do not.</i>

// 1066
// 02:24:00.641 --> 02:24:04.228
// <i>Senator, my cIient
// wouId Iike to read a statement.</i>

// 1067
// 02:24:04.311 --> 02:24:09.900
// <i>Mr. Chairman, I think this statement
// is totaIIy out of order at this time.</i>

// 1068
// 02:24:10.067 --> 02:24:15.906
// <i>Sir, my cIient has answered this
// committee's questions with sincerity.</i>

// 1069
// 02:24:16.073 --> 02:24:21.954
// <i>He hasn't taken the Fifth Amendment,
// so this statement shouId be heard!</i>

// 1070
// 02:24:23.914 --> 02:24:28.877
// <i>No, I'll allow Mr. Corleone to read
// his statement. I'II put it in the record.</i>

// 1071
// 02:24:30.712 --> 02:24:33.841
// <i>In the hopes of cIearing
// my famiIy name</i>

// 1072
// 02:24:33.924 --> 02:24:37.886
// <i>to give my chiIdren their share
// of the American way of Iife</i>

// 1073
// 02:24:37.970 --> 02:24:41.014
// <i>without a bIemish on their name
// and background,</i>

// 1074
// 02:24:41.140 --> 02:24:46.353
// <i>I have appeared before this committee
// and given it aII my cooperation.</i>

// 1075
// 02:24:47.688 --> 02:24:53.235
// <i>I consider it a great personaI dishonor
// to have to deny that I am a criminaI.</i>

// 1076
// 02:24:54.278 --> 02:24:57.614
// <i>I wish to have the foIIowing noted
// for the record...</i>

// 1077
// 02:24:57.781 --> 02:25:01.827
// <i>That I served my country faithfully
// in WorId War Two</i>

// 1078
// 02:25:01.910 --> 02:25:07.124
// <i>and was awarded the Navy Cross
// for actions in defense of my country.</i>

// 1079
// 02:25:07.958 --> 02:25:12.254
// <i>That I have never been arrested
// or indicted for any crime.</i>

// 1080
// 02:25:12.421 --> 02:25:16.383
// <i>That no proof Iinking me to any
// criminaI conspiracy</i>

// 1081
// 02:25:16.467 --> 02:25:21.346
// <i>whether it is caIIed Mafia
// or Cosa Nostra or any other name</i>

// 1082
// 02:25:21.430 --> 02:25:23.765
// <i>has ever been made pubIic.</i>

// 1083
// 02:25:23.932 --> 02:25:25.893
// <i>I have not taken refuge
// behind the Fifth Amendment,</i>

// 1084
// 02:25:25.976 --> 02:25:29.146
// <i>aIthough it's my right to do so.</i>

// 1085
// 02:25:31.982 --> 02:25:37.571
// <i>I chaIIenge this committee to produce
// any witness or evidence against me</i>

// 1086
// 02:25:37.696 --> 02:25:43.619
// <i>and if they do not, I hope they wiII have
// the decency to cIear my name</i>

// 1087
// 02:25:43.702 --> 02:25:47.331
// <i>with the same pubIicity
// with which they have besmirched it.</i>

// 1088
// 02:25:48.707 --> 02:25:54.254
// <i>I'm sure we're impressed. ParticuIarIy
// with your Iove for our country.</i>

// 1089
// 02:25:54.421 --> 02:25:57.174
// <i>We'II be in recess
// untiI 10:00 a.m. Monday</i>

// 1090
// 02:25:57.341 --> 02:26:02.095
// <i>when we wiII produce a witness who'II
// corroborate the charges against you.</i>

// 1091
// 02:26:02.262 --> 02:26:07.267
// <i>At which time you may very well
// be subject to indictment for perjury.</i>

// 1092
// 02:26:07.351 --> 02:26:11.855
// <i>I remind you that you're stiII
// under subpoena. Adjourned!</i>

// 1093
// 02:26:16.944 --> 02:26:18.654
// Ten-to-one shot, you said.

// 1094
// 02:26:18.737 --> 02:26:23.492
// A ten-to-one shot
// he would take the Fifth, and I'd lose!

// 1095
// 02:26:23.575 --> 02:26:28.247
// You sound like my bookie.
// I owe that monkey my life.

// 1096
// 02:26:29.289 --> 02:26:32.835
// -Well, just get a good night's sleep.
// -Yeah.

// 1097
// 02:26:32.918 --> 02:26:35.087
// You've got a big day tomorrow.

// 1098
// 02:26:35.170 --> 02:26:38.799
// I've got you a new suit,
// new shirt, new tie.

// 1099
// 02:26:39.466 --> 02:26:42.761
// I'll shave you myself in the morning.

// 1100
// 02:26:42.928 --> 02:26:46.974
// You'll look respectable for 50 million
// of your fellow Americans.

// 1101
// 02:26:47.057 --> 02:26:52.271
// Tomorrow... My life won't be worth
// a nickel after tomorrow.

// 1102
// 02:26:53.272 --> 02:26:56.900
// Come on! I saw this 19 times.

// 1103
// 02:26:57.985 --> 02:27:01.780
// You've got a great home here,
// for the rest of your life.

// 1104
// 02:27:01.947 --> 02:27:05.075
// Nobody gets near you,
// you're not going anywhere.

// 1105
// 02:27:05.242 --> 02:27:10.164
// That's great. Beautiful.
// Some deal I made.

// 1106
// 02:27:10.247 --> 02:27:13.083
// You'll live like a king. You'll be a hero.

// 1107
// 02:27:13.167 --> 02:27:15.961
// You'll live better here
// than most people outside.

// 1108
// 02:27:16.128 --> 02:27:18.422
// Some deal!

// 1109
// 02:27:21.008 --> 02:27:24.887
// Alive. Pentangeli is alive.

// 1110
// 02:27:26.638 --> 02:27:31.935
// -How did they get their hands on him?
// -Roth. He engineered it, Michael.

// 1111
// 02:27:32.811 --> 02:27:35.189
// When Frankie went to make a deal with
// the Rosato brothers

// 1112
// 02:27:35.272 --> 02:27:37.316
// they tried to kill him.

// 1113
// 02:27:37.399 --> 02:27:39.651
// He thought you double-crossed him.

// 1114
// 02:27:40.694 --> 02:27:44.031
// Our people with the detectives
// said he was half dead, scared

// 1115
// 02:27:44.114 --> 02:27:46.825
// and shouted that you'd turned on him.

// 1116
// 02:27:47.117 --> 02:27:51.288
// They already had him on possession,
// bookmaking, murder one and more.

// 1117
// 02:27:53.123 --> 02:27:58.837
// The FBI has him airtight.
// He's on an army base, 24 hour guards.

// 1118
// 02:27:59.004 --> 02:28:01.632
// We can't get to him. You've opened
// yourself to five counts of perjury.

// 1119
// 02:28:06.386 --> 02:28:09.389
// What about Fredo?
// What does he know?

// 1120
// 02:28:09.473 --> 02:28:13.143
// He says he doesn't know anything,
// and I believe him.

// 1121
// 02:28:13.310 --> 02:28:17.606
// Roth, he played this one beautifully.

// 1122
// 02:28:24.905 --> 02:28:27.699
// I'm going to talk to Fredo.

// 1123
// 02:29:06.947 --> 02:29:09.658
// I haven't got a lot to say, Mike.

// 1124
// 02:29:11.201 --> 02:29:13.704
// We have time.

// 1125
// 02:29:13.871 --> 02:29:17.040
// I was kept pretty much in the dark.

// 1126
// 02:29:18.375 --> 02:29:20.502
// I didn't know all that much.

// 1127
// 02:29:21.420 --> 02:29:26.258
// What about now? Is there anything
// you can help me out with?

// 1128
// 02:29:26.884 --> 02:29:29.094
// Anything you can tell me now?

// 1129
// 02:29:31.054 --> 02:29:33.724
// They've got Pentangeli.

// 1130
// 02:29:48.363 --> 02:29:52.075
// I didn't know
// it was going to be a hit, Mike.

// 1131
// 02:29:52.242 --> 02:29:54.536
// I swear to God I didn't know.

// 1132
// 02:29:57.289 --> 02:30:01.627
// Johnny Ola bumped into me
// in Beverly Hills.

// 1133
// 02:30:03.462 --> 02:30:06.548
// He said that he wanted to talk.

// 1134
// 02:30:08.091 --> 02:30:14.264
// He said that you and Roth
// were in on a big deal together.

// 1135
// 02:30:16.809 --> 02:30:21.146
// And that there was something in it
// for me if I could help him out.

// 1136
// 02:30:21.230 --> 02:30:25.150
// He said that you were being tough
// on the negotiations

// 1137
// 02:30:25.234 --> 02:30:29.613
// but if they could get a little help
// and close the deal fast,

// 1138
// 02:30:31.156 --> 02:30:33.742
// it would be good for the family.

// 1139
// 02:30:35.285 --> 02:30:39.790
// And you believed that story?
// You believed that?

// 1140
// 02:30:39.957 --> 02:30:44.044
// He said there was something in it
// for me, on my own!

// 1141
// 02:30:44.128 --> 02:30:48.257
// -I've always taken care of you, Fredo.
// -Taken care of me?

// 1142
// 02:30:49.591 --> 02:30:52.386
// You're my kid brother!
// You take care of me?

// 1143
// 02:30:53.387 --> 02:30:57.474
// Did you ever think about that?
// Did you ever once think about that?

// 1144
// 02:30:58.559 --> 02:31:02.729
// "Send Fredo off to do this,
// send Fredo off to do that!"

// 1145
// 02:31:03.355 --> 02:31:07.901
// "Let Fredo take care of some
// Mickey Mouse nightclub somewhere. "

// 1146
// 02:31:07.985 --> 02:31:11.071
// "Let Fredo fetch somebody
// at the airport!"

// 1147
// 02:31:11.155 --> 02:31:14.241
// I'm your older brother,
// but was stepped over!

// 1148
// 02:31:14.408 --> 02:31:18.162
// -It's the way Pop wanted it.
// -It's not the way I wanted it!

// 1149
// 02:31:18.954 --> 02:31:23.834
// I can handle things, I'm smart!
// Not like everybody says.

// 1150
// 02:31:24.001 --> 02:31:27.921
// Like dumb. I'm smart
// and I want respect!

// 1151
// 02:31:35.596 --> 02:31:40.809
// Is there anything you can tell me about
// this investigation? Anything more?

// 1152
// 02:31:48.817 --> 02:31:54.865
// The Senate lawyer, Questadt.
// He belongs to Roth.

// 1153
// 02:32:04.541 --> 02:32:06.293
// Fredo,

// 1154
// 02:32:08.754 --> 02:32:11.381
// you're nothing to me now.

// 1155
// 02:32:13.217 --> 02:32:15.677
// Not a brother, not a friend.

// 1156
// 02:32:17.471 --> 02:32:20.474
// I don't want to know you,
// or what you do.

// 1157
// 02:32:21.558 --> 02:32:24.561
// I don't want to see you at the hotels.

// 1158
// 02:32:24.645 --> 02:32:27.231
// I don't want you near my house.

// 1159
// 02:32:29.191 --> 02:32:33.862
// When you see our mother, I want
// to know in advance, so I won't be there.

// 1160
// 02:32:35.447 --> 02:32:37.074
// You understand?

// 1161
// 02:32:46.875 --> 02:32:48.836
// Mikey.

// 1162
// 02:32:55.425 --> 02:32:59.263
// I don't want anything to happen to him
// while my mother's alive.

// 1163
// 02:33:49.146 --> 02:33:52.649
// There's more people
// than at a ballgame in here.

// 1164
// 02:33:52.816 --> 02:33:56.987
// -Hey, there's Willi Cicci!
// -Frankie Five-Angels...

// 1165
// 02:34:16.381 --> 02:34:18.967
// <i>This committee wiII come to order!</i>

// 1166
// 02:34:21.720 --> 02:34:24.515
// <i>-State your name, pIease.
// -Frank PentangeIi.</i>

// 1167
// 02:34:24.598 --> 02:34:28.352
// <i>-Where were you born?
// -Partinico, it's outside of Palermo.</i>

// 1168
// 02:34:28.519 --> 02:34:30.562
// <i>Where do you Iive now?</i>

// 1169
// 02:34:30.729 --> 02:34:35.943
// <i>I Iive in an army barracks
// with the FBI guys.</i>

// 1170
// 02:34:36.985 --> 02:34:41.448
// <i>We have here a witness
// that wiII further testify</i>

// 1171
// 02:34:41.573 --> 02:34:47.955
// <i>to MichaeI CorIeone's ruIe of a criminaI
// empire that controIs aII gambIing.</i>

// 1172
// 02:34:48.205 --> 02:34:53.127
// <i>This witness has had no buffer
// between himseIf and MichaeI CorIeone.</i>

// 1173
// 02:34:53.210 --> 02:34:56.421
// <i>He can corroborate enough charges</i>

// 1174
// 02:34:56.505 --> 02:35:01.176
// <i>for us to recommend a charge
// of perjury against MichaeI CorIeone.</i>

// 1175
// 02:35:01.343 --> 02:35:03.303
// -Senator.
// -Thank you, Chairman.

// 1176
// 02:35:04.680 --> 02:35:06.223
// <i>Mr. PentangeIi.</i>

// 1177
// 02:35:07.432 --> 02:35:13.105
// <i>Mr. PentangeIi. Were you a member
// of the CorIeone famiIy?</i>

// 1178
// 02:35:13.272 --> 02:35:18.318
// <i>Did you serve under Caporegime,
// Peter Clemenza,</i>

// 1179
// 02:35:18.402 --> 02:35:22.948
// <i>and under Vito Corleone,
// aIso known as the Godfather?</i>

// 1180
// 02:35:28.662 --> 02:35:31.290
// <i>I never knew any Godfather.</i>

// 1181
// 02:35:33.834 --> 02:35:35.961
// <i>I have my own famiIy.</i>

// 1182
// 02:35:39.381 --> 02:35:41.925
// <i>Mr. PentangeIi, you...</i>

// 1183
// 02:35:42.092 --> 02:35:46.472
// <i>You are contradicting
// your own sworn statement.</i>

// 1184
// 02:35:46.597 --> 02:35:50.350
// <i>I ask you again, sir,
// here and now under oath...</i>

// 1185
// 02:35:50.434 --> 02:35:54.688
// <i>were you at any time a member of
// a crime organization</i>

// 1186
// 02:35:54.772 --> 02:35:56.648
// <i>Ied by MichaeI CorIeone?</i>

// 1187
// 02:35:56.732 --> 02:35:59.735
// I don't know nothing about that!

// 1188
// 02:36:02.738 --> 02:36:06.700
// I was in the olive oil business
// with his father

// 1189
// 02:36:06.784 --> 02:36:09.453
// but that was a long time ago.

// 1190
// 02:36:10.496 --> 02:36:13.582
// <i>We have a sworn affidavit.</i>

// 1191
// 02:36:15.250 --> 02:36:19.963
// <i>Your sworn affidavit, that you murdered
// on the orders of MichaeI CorIeone.</i>

// 1192
// 02:36:20.088 --> 02:36:24.593
// <i>Do you deny this confession, and do
// you reaIize what wiII happen if you do?</i>

// 1193
// 02:36:24.676 --> 02:36:27.846
// <i>The FBI guys promised me a deaI</i>

// 1194
// 02:36:27.971 --> 02:36:33.644
// <i>so I made up a Iot of stuff about
// MichaeI CorIeone, just to pIease them.</i>

// 1195
// 02:36:33.811 --> 02:36:37.815
// <i>But it was aII Iies. Everything!</i>

// 1196
// 02:36:38.482 --> 02:36:40.651
// <i>They kept saying,</i>

// 1197
// 02:36:40.734 --> 02:36:45.781
// <i>"MichaeI CorIeone did this"
// and "MichaeI CorIeone did that".</i>

// 1198
// 02:36:47.324 --> 02:36:51.328
// <i>So I said, "Yeah, sure. Why not?"</i>

// 1199
// 02:36:51.495 --> 02:36:57.709
// <i>Mr. Corleone, would you kindly identify
// the gentIeman sitting to your left?</i>

// 1200
// 02:36:57.793 --> 02:37:00.003
// I can answer that.

// 1201
// 02:37:00.170 --> 02:37:02.548
// His name is Vincenzo Pentangeli.

// 1202
// 02:37:03.549 --> 02:37:07.886
// <i>-Is he reIated to the witness?
// -He is, I believe, his brother.</i>

// 1203
// 02:37:08.220 --> 02:37:12.850
// <i>-WiII he come forward and be sworn?
// -He doesn't understand EngIish.</i>

// 1204
// 02:37:13.016 --> 02:37:16.061
// He came at his own expense
// to aid his brother.

// 1205
// 02:37:16.895 --> 02:37:20.607
// He's not under subpoena
// and has an impeccable reputation.

// 1206
// 02:37:20.691 --> 02:37:24.486
// <i>-He knows nothing about this?
// -To my knowledge, nothing.</i>

// 1207
// 02:37:24.570 --> 02:37:28.824
// <i>I'm going to find out what happened!
// This committee is now adjourned.</i>

// 1208
// 02:37:29.533 --> 02:37:31.618
// <i>-The witness is excused.
// -Senator!</i>

// 1209
// 02:37:32.703 --> 02:37:36.373
// Senator! This committee
// owes an apology!

// 1210
// 02:37:36.874 --> 02:37:40.878
// This committee owes an apology.
// Apology, Senator!

// 1211
// 02:38:08.489 --> 02:38:12.493
// -Michael, excuse me.
// -Hello, darling.

// 1212
// 02:38:12.910 --> 02:38:16.413
// The children are outside. We're going.

// 1213
// 02:38:17.748 --> 02:38:20.417
// What do you mean?
// We're leaving tomorrow.

// 1214
// 02:38:21.251 --> 02:38:23.670
// Rocco?

// 1215
// 02:38:24.713 --> 02:38:27.299
// I'll be in my room, Mike.

// 1216
// 02:38:30.052 --> 02:38:33.138
// Michael, I'm not going back to Nevada.

// 1217
// 02:38:33.222 --> 02:38:36.642
// I brought the children
// to say goodbye to you.

// 1218
// 02:38:39.728 --> 02:38:42.272
// I'm very happy for you.

// 1219
// 02:38:42.439 --> 02:38:46.944
// I always knew you were too smart
// to let any of them beat you.

// 1220
// 02:38:48.403 --> 02:38:52.991
// -Why don't you sit down?
// -No, I'm not going to stay long.

// 1221
// 02:38:53.158 --> 02:38:56.912
// There are some things
// I'd like to talk to you about.

// 1222
// 02:38:57.079 --> 02:39:02.126
// Things that have been on my mind,
// changes I want to make.

// 1223
// 02:39:02.292 --> 02:39:05.337
// I think it's too late for changes, Michael.

// 1224
// 02:39:06.505 --> 02:39:11.218
// -I wasn't going to say anything...
// -What do you mean, "too late"?

// 1225
// 02:39:16.640 --> 02:39:19.309
// What really happened with Pentangeli?

// 1226
// 02:39:25.107 --> 02:39:30.320
// -His brother came and helped him.
// -I didn't even know he had a brother.

// 1227
// 02:39:30.487 --> 02:39:32.281
// Where is he now?

// 1228
// 02:39:33.615 --> 02:39:36.285
// He's on a plane, back to Sicily.

// 1229
// 02:39:36.952 --> 02:39:39.496
// All he had to do was show his face.

// 1230
// 02:39:41.165 --> 02:39:46.003
// It was between the brothers, Kay.
// I had nothing to do with it.

// 1231
// 02:39:53.844 --> 02:39:57.723
// I don't want you going!
// Not you, not the kids. No.

// 1232
// 02:39:58.849 --> 02:40:02.853
// You're my wife and my children.
// I love you and won't allow it.

// 1233
// 02:40:04.146 --> 02:40:07.983
// You say you love me,
// but talk about allowing me to leave!

// 1234
// 02:40:08.150 --> 02:40:11.862
// Things between men and women
// will not change.

// 1235
// 02:40:12.029 --> 02:40:15.908
// You've become blind!
// Look what's happened to us.

// 1236
// 02:40:16.074 --> 02:40:21.246
// -Look what's happened to our son!
// -Nothing's happened to him. He's fine!

// 1237
// 02:40:21.413 --> 02:40:24.625
// -Anthony is not fine!
// -I don't want to hear about it.

// 1238
// 02:40:24.792 --> 02:40:28.712
// -Anthony is...
// -I don't want to hear about it!

// 1239
// 02:40:30.047 --> 02:40:32.090
// Over!

// 1240
// 02:40:44.103 --> 02:40:47.731
// At this moment
// I feel no love for you at all.

// 1241
// 02:40:48.816 --> 02:40:53.821
// I never thought that would ever happen,
// but it has.

// 1242
// 02:41:08.168 --> 02:41:10.254
// Kay...

// 1243
// 02:41:13.090 --> 02:41:15.259
// We're leaving tomorrow.

// 1244
// 02:41:15.968 --> 02:41:19.138
// Why don't you take the kids
// back to their room?

// 1245
// 02:41:19.221 --> 02:41:25.060
// -Michael, you haven't heard me.
// -Kay, what do you want from me?

// 1246
// 02:41:25.310 --> 02:41:31.692
// Do you expect me to let you go,
// to let you take my children from me?

// 1247
// 02:41:32.484 --> 02:41:38.073
// Don't you know me? Don't you know
// that that's an impossibility?

// 1248
// 02:41:38.157 --> 02:41:42.077
// That I'd use all my power
// to keep that from happening?

// 1249
// 02:41:42.911 --> 02:41:45.289
// Don't you know that?

// 1250
// 02:41:46.957 --> 02:41:48.834
// Kay...

// 1251
// 02:41:51.712 --> 02:41:56.341
// In time, you'll feel differently.

// 1252
// 02:41:57.926 --> 02:42:00.846
// You'll be glad I stopped you now.

// 1253
// 02:42:02.764 --> 02:42:04.767
// I know that.

// 1254
// 02:42:06.769 --> 02:42:10.189
// I know you blame me
// for losing the baby.

// 1255
// 02:42:12.024 --> 02:42:13.108
// Yes.

// 1256
// 02:42:14.359 --> 02:42:17.112
// I know what that meant to you.

// 1257
// 02:42:19.156 --> 02:42:21.283
// I'll make it up to you, Kay.

// 1258
// 02:42:22.159 --> 02:42:24.995
// I swear I'll make it up to you. I'll...

// 1259
// 02:42:26.288 --> 02:42:28.207
// I'm going to change.

// 1260
// 02:42:29.666 --> 02:42:33.837
// I'll change. I've learned that I have
// the strength to change.

// 1261
// 02:42:36.006 --> 02:42:39.009
// Then you'll forget about
// this miscarriage

// 1262
// 02:42:39.843 --> 02:42:44.723
// and we'll have another child.
// And we'll go on, you and I.

// 1263
// 02:42:46.058 --> 02:42:50.229
// -We'll go on.
// -Oh, Michael!

// 1264
// 02:42:51.355 --> 02:42:53.732
// Michael, you are blind.

// 1265
// 02:42:55.567 --> 02:42:57.903
// It wasn't a miscarriage.

// 1266
// 02:42:59.947 --> 02:43:01.490
// It was an abortion.

// 1267
// 02:43:03.367 --> 02:43:08.539
// An abortion, Michael.
// Just like our marriage is an abortion.

// 1268
// 02:43:09.456 --> 02:43:12.918
// Something that's unholy and evil!

// 1269
// 02:43:14.545 --> 02:43:16.880
// I didn't want your son, Michael!

// 1270
// 02:43:17.714 --> 02:43:21.552
// I wouldn't bring another one
// of your sons into this world!

// 1271
// 02:43:23.470 --> 02:43:25.973
// It was an abortion, Michael.

// 1272
// 02:43:26.056 --> 02:43:31.728
// It was a son and I had it killed
// because this must all end!

// 1273
// 02:43:33.313 --> 02:43:37.401
// I know now that it's over. I knew it then.

// 1274
// 02:43:38.819 --> 02:43:43.782
// There would be no way, Michael,
// no way you could ever forgive me.

// 1275
// 02:43:44.241 --> 02:43:48.912
// Not with this Sicilian thing
// that's been going on for 2,000...

// 1276
// 02:43:56.837 --> 02:43:59.715
// -You won't take my children.
// -I will.

// 1277
// 02:43:59.798 --> 02:44:04.178
// -You won't take my children!
// -They're my children too.

// 1278
// 02:45:33.976 --> 02:45:37.521
// Fredo, give this to Grandmother.

// 1279
// 02:47:52.322 --> 02:47:54.324
// Don Ciccio, it's Tommasino.

// 1280
// 02:47:58.245 --> 02:48:01.290
// Allow me the honor of
// introducing someone.

// 1281
// 02:48:01.623 --> 02:48:04.460
// My partner in America, in New York.

// 1282
// 02:48:05.127 --> 02:48:06.962
// His name is Vito Corleone.

// 1283
// 02:48:07.671 --> 02:48:10.215
// We'll send him olive oil from here.

// 1284
// 02:48:11.008 --> 02:48:12.468
// To his company in America.

// 1285
// 02:48:17.264 --> 02:48:20.559
// They're olive oil importers, Don Ciccio.

// 1286
// 02:48:30.277 --> 02:48:35.866
// We'd like your blessing, and your
// permission to start work.

// 1287
// 02:48:36.992 --> 02:48:39.870
// Where is this young man
// from New York?

// 1288
// 02:48:43.207 --> 02:48:46.376
// Have him come closer.

// 1289
// 02:48:47.377 --> 02:48:50.214
// I can't see him so good.

// 1290
// 02:48:57.221 --> 02:49:00.891
// My respects, Don Ciccio.
// Give me your blessing.

// 1291
// 02:49:03.393 --> 02:49:05.104
// Bless you!

// 1292
// 02:49:06.980 --> 02:49:08.565
// What's your name?

// 1293
// 02:49:13.987 --> 02:49:17.157
// You took the name of this town!

// 1294
// 02:49:17.699 --> 02:49:19.451
// And what's your father's name?

// 1295
// 02:49:19.576 --> 02:49:23.247
// His name was...Antonio Andolini.

// 1296
// 02:49:23.622 --> 02:49:27.251
// Louder, I don't hear so good.

// 1297
// 02:49:30.712 --> 02:49:33.924
// My father's name was
// Antonio Andolini...

// 1298
// 02:49:34.258 --> 02:49:36.969
// ...and this is for you!

// 1299
// 02:50:58.884 --> 02:51:01.512
// Michael, say goodbye.

// 1300
// 02:52:04.741 --> 02:52:06.160
// Hi, Al.

// 1301
// 02:52:18.213 --> 02:52:21.216
// Can I speak with you
// for a second, Tom?

// 1302
// 02:52:29.141 --> 02:52:30.851
// Tom, where's Mike?

// 1303
// 02:52:32.102 --> 02:52:34.146
// Waiting for you to leave.

// 1304
// 02:52:36.732 --> 02:52:41.278
// -Can I talk with him?
// -Sorry, Fredo. No chance.

// 1305
// 02:52:41.862 --> 02:52:45.157
// -Can I see him?
// -He's in the boathouse.

// 1306
// 02:52:58.253 --> 02:53:00.631
// Michael, it's Connie.

// 1307
// 02:53:21.902 --> 02:53:23.487
// Michael...

// 1308
// 02:53:26.490 --> 02:53:29.993
// I'd like to stay close to home now,
// if it's all right.

// 1309
// 02:53:38.502 --> 02:53:40.754
// Is Kay coming?

// 1310
// 02:53:43.215 --> 02:53:44.883
// No.

// 1311
// 02:53:53.016 --> 02:53:55.853
// Fredo's in the house with Mama.

// 1312
// 02:53:55.936 --> 02:53:59.857
// He asked for you
// and Tom said you wouldn't see him.

// 1313
// 02:54:03.527 --> 02:54:05.362
// That's right.

// 1314
// 02:54:08.198 --> 02:54:11.577
// Kids, why don't you go outside
// for a while?

// 1315
// 02:54:15.164 --> 02:54:17.541
// Please, I want to talk to you.

// 1316
// 02:54:29.052 --> 02:54:33.056
// Michael, I hated you for so many years.

// 1317
// 02:54:33.515 --> 02:54:38.854
// I think I did things to myself,
// to hurt myself, so that you'd know

// 1318
// 02:54:42.065 --> 02:54:44.193
// that I could hurt you.

// 1319
// 02:54:50.282 --> 02:54:54.703
// You were just being strong for all of us,
// the way Papa was.

// 1320
// 02:54:55.287 --> 02:54:57.164
// And I forgive you.

// 1321
// 02:55:01.835 --> 02:55:03.796
// Can't you forgive Fredo?

// 1322
// 02:55:04.838 --> 02:55:09.468
// He's so sweet,
// and helpless without you.

// 1323
// 02:55:15.808 --> 02:55:19.645
// You need me.
// I want to take care of you now.

// 1324
// 02:55:29.488 --> 02:55:31.031
// Connie.

// 1325
// 02:57:13.258 --> 02:57:15.886
// Tom, sit down.

// 1326
// 02:57:27.606 --> 02:57:31.360
// Our friend and business partner,
// Hyman Roth, is in the news.

// 1327
// 02:57:32.736 --> 02:57:37.366
// -Did you hear about it?
// -I hear that he's in Israel.

// 1328
// 02:57:37.908 --> 02:57:42.538
// The High Court in Israel
// turned down his request to live there.

// 1329
// 02:57:42.704 --> 02:57:46.291
// His passport's been invalidated,
// except to return here.

// 1330
// 02:57:46.375 --> 02:57:49.128
// He landed in Buenos Aires yesterday.

// 1331
// 02:57:49.419 --> 02:57:53.340
// He offered them a million dollars
// if they'd let him live there.

// 1332
// 02:57:54.299 --> 02:57:58.303
// -They turned him down.
// -He's going to try Panama.

// 1333
// 02:57:58.429 --> 02:58:03.100
// Panama won't take him.
// Not for a million, not for ten million.

// 1334
// 02:58:03.475 --> 02:58:08.188
// His condition is reported as terminal.
// He's only got six months left.

// 1335
// 02:58:08.355 --> 02:58:11.358
// He's had the same heart attack
// for 20 years.

// 1336
// 02:58:11.525 --> 02:58:15.696
// -That plane goes to Miami.
// -That's right. That's where I want it met.

// 1337
// 02:58:16.822 --> 02:58:22.202
// Impossible. They'll turn him over to the
// Internal Revenue, Customs and FBI.

// 1338
// 02:58:22.369 --> 02:58:25.581
// It's not impossible.
// Nothing's impossible.

// 1339
// 02:58:25.664 --> 02:58:27.124
// It would be
// like trying to kill the President.

// 1340
// 02:58:27.207 --> 02:58:31.712
// -There's no way we can get to him!
// -Tom, you surprise me.

// 1341
// 02:58:34.506 --> 02:58:38.135
// If anything in this life is certain,

// 1342
// 02:58:38.218 --> 02:58:41.430
// if history has taught us anything,

// 1343
// 02:58:41.513 --> 02:58:44.141
// it's that you can kill anyone.

// 1344
// 02:58:49.480 --> 02:58:54.401
// -Rocco?
// -Difficult. Not impossible.

// 1345
// 02:58:54.735 --> 02:58:56.445
// Good.

// 1346
// 02:58:58.906 --> 02:59:02.493
// Why did you ask me if something
// was wrong when I came in?

// 1347
// 02:59:06.163 --> 02:59:12.085
// I thought you were going to tell me that
// you were moving your family to Vegas

// 1348
// 02:59:13.462 --> 02:59:17.341
// and that you'd been offered the Vice
// Presidency of the Houstan hotels there.

// 1349
// 02:59:19.468 --> 02:59:24.306
// -I thought you'd tell me that.
// -Must I tell you every offer I turn down?

// 1350
// 02:59:28.519 --> 02:59:31.313
// -Let's do business.
// -All right.

// 1351
// 02:59:33.190 --> 02:59:36.193
// Just consider this, Michael.
// Just consider it.

// 1352
// 02:59:37.444 --> 02:59:39.571
// Roth and the Rosatos are on the run.

// 1353
// 02:59:39.655 --> 02:59:42.199
// Are they worth it,
// are they strong enough?

// 1354
// 02:59:42.699 --> 02:59:47.579
// Is it worth it? You've won.
// Do you want to wipe everybody out?

// 1355
// 02:59:47.663 --> 02:59:53.001
// I don't feel I have to wipe everybody
// out, Tom. Just my enemies, that's all.

// 1356
// 03:00:00.717 --> 03:00:03.387
// Are you with me in these things,
// or what?

// 1357
// 03:00:05.514 --> 03:00:10.936
// Because if not, you can take your wife,
// your family and your mistress

// 1358
// 03:00:11.103 --> 03:00:14.231
// and move them all to Las Vegas.

// 1359
// 03:00:17.359 --> 03:00:22.406
// Why do you hurt me, Michael? I've
// always been loyal to you. What is this?

// 1360
// 03:00:26.994 --> 03:00:28.662
// So...you're staying?

// 1361
// 03:00:30.706 --> 03:00:33.041
// Yes, I'm staying.

// 1362
// 03:00:35.627 --> 03:00:37.754
// What do you want me to do?

// 1363
// 03:00:38.255 --> 03:00:40.257
// Hey, Anthony.

// 1364
// 03:00:40.799 --> 03:00:45.429
// How would you like it if I taught you
// how to catch the really big fish?

// 1365
// 03:00:45.512 --> 03:00:48.015
// -Would you like that?
// -Okay.

// 1366
// 03:00:48.182 --> 03:00:50.809
// You know, when I was your age,

// 1367
// 03:00:51.268 --> 03:00:58.150
// I went out fishing with all my brothers
// and my father. Everybody.

// 1368
// 03:00:59.318 --> 03:01:02.821
// I was the only one that caught a fish.

// 1369
// 03:01:04.823 --> 03:01:07.868
// Nobody else could catch one.
// Do you know how I did it?

// 1370
// 03:01:09.453 --> 03:01:13.248
// Every time I put the line in the water
// I said a Hail Mary

// 1371
// 03:01:13.415 --> 03:01:17.044
// and every time I said a Hail Mary,
// I caught a fish.

// 1372
// 03:01:19.463 --> 03:01:23.634
// Do you believe that? It's true.
// That's the secret.

// 1373
// 03:01:25.719 --> 03:01:29.556
// -Do you want to try it out on the lake?
// -Okay.

// 1374
// 03:01:31.350 --> 03:01:32.684
// What else have you got?

// 1375
// 03:01:59.253 --> 03:02:01.839
// Everything will be okay.

// 1376
// 03:02:02.005 --> 03:02:05.926
// -Did my brother go back?
// -Yeah, don't worry.

// 1377
// 03:02:06.093 --> 03:02:11.014
// He's ten times tougher than me,
// my brother. He's old-fashioned.

// 1378
// 03:02:12.057 --> 03:02:15.352
// He didn't want dinner,
// just wanted to go home.

// 1379
// 03:02:15.436 --> 03:02:20.482
// That's my brother! Nothing could get
// him away from that two-mule town.

// 1380
// 03:02:20.649 --> 03:02:24.486
// He could have been big here.
// He could have had his own family.

// 1381
// 03:02:29.700 --> 03:02:31.660
// Tom,

// 1382
// 03:02:32.369 --> 03:02:34.955
// what do I do now?

// 1383
// 03:02:35.664 --> 03:02:37.666
// Frankie.

// 1384
// 03:02:42.212 --> 03:02:46.216
// You were always interested
// in politics and history.

// 1385
// 03:02:47.718 --> 03:02:51.180
// I remember you talking about Hitler
// back in '33.

// 1386
// 03:02:51.346 --> 03:02:54.975
// Yeah, I still read a lot.
// I get good stuff in there.

// 1387
// 03:02:57.519 --> 03:03:03.275
// You were around the old-timers, who
// built the organization of the families,

// 1388
// 03:03:03.400 --> 03:03:08.822
// basing them on the old Roman legions,
// with "regimes," "capos" and "soldiers".

// 1389
// 03:03:10.073 --> 03:03:14.077
// -And it worked.
// -Yeah, it worked.

// 1390
// 03:03:14.870 --> 03:03:18.373
// Those were the great old days,
// you know.

// 1391
// 03:03:18.540 --> 03:03:21.668
// We was like the Roman Empire.

// 1392
// 03:03:21.752 --> 03:03:25.255
// The Corleone family
// was like the Roman Empire.

// 1393
// 03:03:27.633 --> 03:03:29.593
// Yeah,

// 1394
// 03:03:29.760 --> 03:03:32.137
// it was once.

// 1395
// 03:03:36.558 --> 03:03:38.102
// Frankie.

// 1396
// 03:03:48.570 --> 03:03:52.116
// When a plot
// against the Emperor failed

// 1397
// 03:03:53.367 --> 03:03:56.829
// the plotters were always
// given a chance

// 1398
// 03:03:58.789 --> 03:04:02.376
// to let their families keep their fortunes.
// Right?

// 1399
// 03:04:02.459 --> 03:04:04.586
// Only the rich guys.

// 1400
// 03:04:04.670 --> 03:04:09.675
// The little guys got knocked off and all
// their estates went to the Emperors.

// 1401
// 03:04:09.842 --> 03:04:15.055
// Unless they went home and killed
// themselves, then nothing happened.

// 1402
// 03:04:16.223 --> 03:04:20.519
// And their families were taken care of.

// 1403
// 03:04:22.146 --> 03:04:25.524
// That was a good break, a nice deal.

// 1404
// 03:04:26.150 --> 03:04:27.609
// Yeah.

// 1405
// 03:04:28.569 --> 03:04:30.654
// They went home

// 1406
// 03:04:31.864 --> 03:04:34.825
// and sat in a hot bath

// 1407
// 03:04:34.992 --> 03:04:37.536
// opened up their veins

// 1408
// 03:04:37.703 --> 03:04:40.414
// and bled to death.

// 1409
// 03:04:41.582 --> 03:04:45.752
// And sometimes they had a little party
// before they did it.

// 1410
// 03:04:51.091 --> 03:04:53.427
// Don't worry about anything,
// Frankie Five-Angels.

// 1411
// 03:04:54.887 --> 03:04:58.182
// Thanks, Tom. Thanks.

// 1412
// 03:05:16.658 --> 03:05:19.787
// -See you, Tom.
// -Addio, Frankie.

// 1413
// 03:05:30.714 --> 03:05:33.842
// Kay. You have to go.

// 1414
// 03:05:35.636 --> 03:05:38.972
// -So pretty...
// -Kay, please hurry. He's coming.

// 1415
// 03:05:47.773 --> 03:05:51.568
// Anthony. Kiss Mama goodbye.

// 1416
// 03:05:54.196 --> 03:05:56.990
// Anthony, kiss your mother goodbye!

// 1417
// 03:05:57.157 --> 03:06:02.246
// Anthony, say goodbye to Mama.
// Anthony. I love you, Anthony.

// 1418
// 03:06:03.372 --> 03:06:05.749
// Kay, please.

// 1419
// 03:06:08.669 --> 03:06:10.629
// All right.

// 1420
// 03:06:23.892 --> 03:06:26.270
// Mary, come here.

// 1421
// 03:06:33.444 --> 03:06:35.028
// Anthony.

// 1422
// 03:06:35.112 --> 03:06:38.115
// Anthony, please. Kiss me once.

// 1423
// 03:08:17.214 --> 03:08:19.299
// Easy.

// 1424
// 03:08:25.013 --> 03:08:28.100
// Anthony! Anthony!

// 1425
// 03:08:28.225 --> 03:08:31.270
// -He's here, we're going fishing.
// -No!

// 1426
// 03:08:31.437 --> 03:08:34.773
// Michael wants to take him to Reno now.

// 1427
// 03:08:34.857 --> 03:08:36.859
// Shit!

// 1428
// 03:08:38.068 --> 03:08:41.530
// Okay, kid, you have to go to Reno
// with your pop.

// 1429
// 03:08:42.489 --> 03:08:46.452
// -I'll take you fishing tomorrow, okay?
// -Okay.

// 1430
// 03:08:50.080 --> 03:08:51.665
// Hey, Anthony.

// 1431
// 03:08:51.748 --> 03:08:56.086
// Listen, I'll catch one for you in secret.

// 1432
// 03:09:00.132 --> 03:09:01.508
// Let's go.

// 1433
// 03:09:40.672 --> 03:09:44.843
// -Mr. Roth, I must take you into custody.
// -I understand.

// 1434
// 03:09:45.010 --> 03:09:48.138
// What's your reaction
// to the Israeli High Court ruling?

// 1435
// 03:09:48.305 --> 03:09:51.100
// I'm a retired investor on a pension.

// 1436
// 03:09:51.266 --> 03:09:56.146
// I went to Israel to live there as a Jew,
// in the twilight of my life.

// 1437
// 03:10:02.486 --> 03:10:06.115
// Hey, Frankie! Come on out,
// let's play some Hearts.

// 1438
// 03:10:14.289 --> 03:10:15.999
// Frankie!

// 1439
// 03:10:31.890 --> 03:10:34.768
// Is it true you're worth
// over 300 million dollars?

// 1440
// 03:10:34.935 --> 03:10:38.564
// I'm a retired investor,
// living on a pension.

// 1441
// 03:10:38.730 --> 03:10:42.276
// I came home to vote
// in the presidential election

// 1442
// 03:10:42.443 --> 03:10:45.863
// because they wouldn't give me
// an absentee ballot.

// 1443
// 03:10:58.208 --> 03:11:00.627
// Jesus Christ.

// 1444
// 03:11:01.670 --> 03:11:06.300
// Hail Mary, full of grace.
// The Lord is with thee.

// 1445
// 03:11:07.760 --> 03:11:10.387
// Blessed art thou amongst women.

// 1446
// 03:11:11.180 --> 03:11:14.308
// Blessed is the fruit of thy womb, Jesus.

// 1447
// 03:11:15.517 --> 03:11:19.730
// Holy Mary, Mother of God,
// pray for us sinners.

// 1448
// 03:12:01.605 --> 03:12:06.777
// Hey! Everybody, pay attention.
// This is my friend Carlo Rizzi.

// 1449
// 03:12:07.569 --> 03:12:10.322
// -You know my brother Fredo.
// -Sure.

// 1450
// 03:12:10.489 --> 03:12:15.244
// This is my stepbrother Tom,
// and that's his girl Theresa.

// 1451
// 03:12:15.327 --> 03:12:18.664
// This cute little thing is my sister Connie.

// 1452
// 03:12:18.747 --> 03:12:21.583
// Say hello to Carlo.
// He's good-looking, isn't he?

// 1453
// 03:12:21.667 --> 03:12:23.252
// Yes.

// 1454
// 03:12:23.418 --> 03:12:27.464
// The droopy thing is Mike.
// We call him Joe College.

// 1455
// 03:12:27.965 --> 03:12:31.844
// Sit down. Talk to each other.

// 1456
// 03:12:32.010 --> 03:12:34.263
// Hey, Mr. Einstein...

// 1457
// 03:12:37.599 --> 03:12:40.102
// -The cake.
// -Sally, get in here!

// 1458
// 03:12:40.269 --> 03:12:42.396
// -I was scared.
// -Come on.

// 1459
// 03:12:43.063 --> 03:12:46.400
// -Where's your father?
// -Christmas shopping.

// 1460
// 03:12:46.567 --> 03:12:48.944
// Let's see that thing.

// 1461
// 03:12:50.654 --> 03:12:52.573
// That's nice!

// 1462
// 03:12:52.656 --> 03:12:56.493
// -Should I put the candles on now?
// -Yeah. You help her, Carlo.

// 1463
// 03:12:57.619 --> 03:13:00.747
// -What is that? Rum?
// -Yeah.

// 1464
// 03:13:05.753 --> 03:13:09.006
// Don't touch the antipasto
// until Pop sees it.

// 1465
// 03:13:09.173 --> 03:13:11.842
// He's not ugly...

// 1466
// 03:13:17.347 --> 03:13:23.604
// What do you think of the nerve of those
// Japs? Bombing us on Pop's birthday.

// 1467
// 03:13:23.687 --> 03:13:27.107
// They didn't know it was Pop's birthday.

// 1468
// 03:13:27.191 --> 03:13:29.860
// Not surprising after the oil embargo.

// 1469
// 03:13:30.027 --> 03:13:34.490
// They've got no right dropping bombs!
// Are you a Jap-lover?

// 1470
// 03:13:34.698 --> 03:13:38.368
// -30,000 enlisted this morning.
// -Bunch of saps...

// 1471
// 03:13:38.535 --> 03:13:42.039
// -Why are they saps?
// -Let's not talk about the war.

// 1472
// 03:13:43.165 --> 03:13:45.000
// You talk to Carlo.

// 1473
// 03:13:46.960 --> 03:13:50.547
// Only saps risk their lives for strangers.

// 1474
// 03:13:50.631 --> 03:13:54.093
// -That's Pop talking.
// -You're right, that's Pop talking!

// 1475
// 03:13:54.218 --> 03:13:58.013
// -They risk their lives for their country.
// -Country isn't your blood.

// 1476
// 03:13:58.097 --> 03:14:04.019
// -I don't feel that way.
// -Then quit college andjoin the army!

// 1477
// 03:14:04.103 --> 03:14:05.604
// I did.

// 1478
// 03:14:06.563 --> 03:14:09.525
// I've enlisted in the Marines.

// 1479
// 03:14:11.735 --> 03:14:14.988
// -Why didn't you come to us?
// -What do you mean?

// 1480
// 03:14:15.072 --> 03:14:19.326
// -Pop managed to get you a deferment.
// -I didn't ask for it.

// 1481
// 03:14:20.077 --> 03:14:22.162
// I didn't want it.

// 1482
// 03:14:23.330 --> 03:14:25.749
// Come on! Knock it off!

// 1483
// 03:14:25.916 --> 03:14:29.670
// -Punk!
// -Sonny, sit down.

// 1484
// 03:14:32.673 --> 03:14:36.176
// Mommy, Daddy's fighting again!

// 1485
// 03:14:39.263 --> 03:14:42.015
// Go and show Carlo the tree.

// 1486
// 03:14:52.317 --> 03:14:53.944
// Nice.

// 1487
// 03:14:55.779 --> 03:14:57.322
// Nice.

// 1488
// 03:14:57.948 --> 03:15:00.617
// Break your father's heart
// on his birthday.

// 1489
// 03:15:01.743 --> 03:15:04.496
// That's swell, Mike. Congratulations.

// 1490
// 03:15:04.580 --> 03:15:06.707
// Don't encourage him!

// 1491
// 03:15:06.790 --> 03:15:09.460
// Get me a drink. Go on!

// 1492
// 03:15:13.338 --> 03:15:16.800
// You don't understand.
// Your father has plans for you.

// 1493
// 03:15:16.967 --> 03:15:21.180
// Many times he and I have talked
// about your future.

// 1494
// 03:15:22.973 --> 03:15:26.810
// You've talked to my father
// about my future?

// 1495
// 03:15:28.103 --> 03:15:32.399
// -My future.
// -Mikey, he has high hopes for you.

// 1496
// 03:15:32.483 --> 03:15:38.030
// -I have my own plans for my future.
// -Did you go to college to get stupid?

// 1497
// 03:15:38.113 --> 03:15:39.990
// He's here!

// 1498
// 03:15:41.950 --> 03:15:43.911
// Come on.

// 1499
// 03:15:46.163 --> 03:15:48.123
// Stupid!

// 1500
// 03:16:05.390 --> 03:16:07.768
// Surprise!

// 1501
// 03:16:10.854 --> 03:16:16.527
// <i>For he's a joIIy good feIIow
// For he's a joIIy good feIIow</i>

// 1502
// 03:16:16.735 --> 03:16:20.531
// <i>That nobody can deny
// Nobody can deny...</i>
// `;
