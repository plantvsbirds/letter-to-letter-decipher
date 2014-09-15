var fs = require('fs');
var alphabets = 'qazwsxedcrfvtgbyhnujmikolp';
fs.readFile('dictionary.txt',{encoding : 'utf-8'},function(err,dict) {
  if (err) console.err(err);
    fs.readFile('password.txt',function(err,pwd) {
    pwd = ('' + pwd).toLowerCase();
    if (err) console.err(err);
    var lines = (pwd).split('\n');
    var token = [];
    lines.forEach(function (l){
      token = token.concat(l.split(' '));
    });
    //console.log(JSON.stringify(token));
    var times = { };
    token.forEach(function (t){
      var str = t;
      while (str.length > 0) {
        times[str[0]] ? times[str[0]] = times[str[0]] + 1 : times[str[0]] = 1;
        str = str.substr(1,str.length);
      }
    });
    //console.log(JSON.stringify(times));
    var most = {
      letterShown : '',
      timesShown : 0
    };
    for (letter in times) {
      if (times[letter] > most.timesShown) {
        most.timesShown = times[letter];
        most.letterShown = letter;
      }
    }
    //console.log(JSON.stringify(most));
      function tryOne (dict,tks,hiddenLetter,realLetter) {
        var ans = {
          success : 0,
          failure : 0
        };
        tks.forEach(function (t) {
          var word = t;
          var pattern = '';
          for (var i = 0; i < t.length; i++) {
            if (word[i] == hiddenLetter) {
              pattern = pattern + hiddenLetter;
            } else {
              pattern = pattern + '[a-z]';
            }
          }
          var reg = new RegExp(pattern + '\n');
          //console.log(pattern);
          //console.log(JSON.stringify(dict.match(reg)));
          if (dict.match(reg))
            ans.success = ans.success + 1;
          else
            ans.failure = ans.failure + 1;

        });
        ans.rate = ans.success / (ans.success + ans.failure);
        ans.letter = hiddenLetter;
        return ans;
      }
      function tryAll(hiddenLetter){
        var results = {};
        for(var i = 0; i < alphabets.length; i = i + 1)
          results[alphabets[i]] = tryOne(dict,token,hiddenLetter,alphabets[i]);  
        var mostMatch = {
          letterMatch : '',
          rateMatch : 0
        };
        for (r in results) {
          if (results[r].rate > mostMatch.rateMatch) {
            mostMatch.letterMatch = results[r].letter;
            mostMatch.rateMatch = results[r].rate;
          }
        }
        return mostMatch;
      }
    //tryAll(most.letterShown);
    /*///testCase
    for(var i = 0; i < alphabets.length; i = i + 1) {
      console.log(alphabets[i]);
      console.log(JSON.stringify(tryAll(alphabets[i])));
    }*/
    
    for(var i = 0; i < alphabets.length; i = i + 1) {
      console.log(alphabets[i]);
      console.log(JSON.stringify(tryAll(alphabets[i])));
    }
    
  })
})
