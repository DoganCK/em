---
layout: post
title:  "Einstein and Candies"
tags: mathematics statistics probability Albert Einstein Satyendra Nath Bose stars and bars
description: How do we count the ways in which indistinguishable objects of a kind can be categorized? Einstein would like to know!
image: /assets/img/einstein-candy_card.png
---
Let's talk about a really interesting candy distribution problem&mdash;you know I mean business when I say 'candy distribution'! It's a well-known problem that has important implications for physics, hence the name 'Einstein' in the title. In a nutshell, [Satyendra Nath Bose](https://en.wikipedia.org/wiki/Satyendra_Nath_Bose) and [Einstein](https://en.wikipedia.org/wiki/Albert_Einstein) wanted to devise a [statistics](https://en.wikipedia.org/wiki/Bose%E2%80%93Einstein_statistics) where they could count the ways non-interacting and indistinguishable particles could be categorized according to their energy-states. This led them to theorize the existence of a special (solider than solid, shall we say) state of matter, called [Bose-Einstein condensate](https://en.wikipedia.org/wiki/Bose%E2%80%93Einstein_condensate).

Enough history! Let's get back to candies.

The problem is one in combinatorics, the sort of thing you might remember from high school. You know, things like how many ways there are to select two individuals out of a group of 5, or how many ways there are to rearrange the letters in the word 'MISSISSIPPI'. Things of that nature, having to do with _counting ways_.

## The Problem

I especially like the way that [FiveThirtyEight](https://fivethirtyeight.com/features/how-many-ways-can-you-raid-the-candy-shop/) exposed a variant of the problem so I'm going to start off with that. We're told that we're in a candy store where there are three types of candy: **Almond Soys**, **Butterflingers** and **Candy Kernels**.
>You’d like to buy at least one candy and at most 100, but you don’t care precisely how many you get of each or how many you get overall. So you might buy one of each, or you might buy 30 Almond Soys, six Butterflingers and 64 Candy Kernels. As long as you have somewhere between one and 100 candies, you’ll leave the store happy.

How many distinct ways are there to buy candy?

When I first heard this problem, I was extremely perplexed. Not only did I have to find all the different combinations of varying numbers of different types of candy, I also had to keep track of the total number of candies so it didn't exceed 100! There was something bizarrely arithmetic, unlike most probability problems. Do I come up with numbers first, and then check if it exceeds 100? In other words, do I assign numbers to different types of candy like 30,40,50 and then eliminate that possibility on the grounds that the sum exceeds 100? That seems doable but extremely unwieldy.

### Digging Deeper

Let's try to understand the problem a little bit more. On the face of it, this is a difficult problem to wrap one's head around. There are two major reasons for this. First, it's possible to buy any number of candies ranging from 1 through 100. Second, even if we know how many candies we are to buy, we still need to count different ways we could buy that many candies. In other words, there are two distinct kinds of unknown that make this problem quite perplexing.

Notice, however, that even as we're fleshing out how difficult this problem is, we're making progress. We've discovered that this could actually be two problems in the guise of one. Namely, it can be possible to treat the two aspects separately. Here's a sketch of a solution: For any number of candies that we buy from 1 through 100, the selections will be mutually exclusive. In other words, there's no way that there is going to be an overlap between any selection of 2 candies and 3 candies; they are going to _count as distinct ways_ of buying candy. So we could, in principle, count how many ways there are of buying $n$ candies, where $n \in [1-100]$. Finally, we could sum them all up together and get the result&mdash;since the _ways_ are disjoint.

Admittedly, this would be a painstaking process to do by hand, but computers can handle that in a fraction of a millisecond.

We're making progress already!

On to the second part of the problem. How to count the ways when there are a specific number of candies to be bought? Let's start with the minimum: 1. Well, since there are three types of candy, there are three different ways of picking: 1 Almond Soy or 1 Butterflinger or 1 Candy Kernel. Easy!

We are $\frac{1}{100}$th way there to solving the second part of the problem! Phew!

How many ways are there to choose two candies? Let's enumerate!

Two of a kinds:

1. Almond Soys x2
2. Butterflingers x2
3. Candy Kernels x2
  
Each of a different kind:

4. Almond Soys x1 & Butterflingers x1
5. Almond Soys x1 & Candy Kernels x1
6. Butterflingers x1 & Candy Kernels x1

So there are 6 different ways for us to leave the store with a total of two candies. We've already found out that with 1 total candy there are a total of 3 ways. That makes 9 ways total.

We're $\frac{1}{50}$th way there to solving the second part of the problem!

Let's keep going! And, let's enumarate all the different possible ways of leaving with exactly 3 candies...

No, I'm joking!

### First Change in Perspective

Instead, let's start thinking about the problem in more abstract terms. Let's first of all represent the three different candy brands by **circles, rectangles and crosses**, so that we imply this applies to any set of distinguishable kinds, not just candy bars. Besides, between you and me, I am too lazy to design brand new candy packaging for Almond Soys, Butterflingers and Candy Kernels.

Another act of abstraction is to realize that we are dealing with groups of things. Almond Soys represent one group, Butterflingers another, and so on. What's a better way to separate things than to put separators between them. So we put separators to distinguish different groups.

<script src="https://d3js.org/d3.v5.min.js"></script>
<div id="interactive1"></div>
<div class="fig-desc">Try moving the separators!</div>

In the figure above, we have 10 slots for candies, and 2 slots for the separators so that we have 3 groups of candies. And instead of 'groups', let's call each area separated by separators '**bins**'. So, we have 3 bins in the above figure. It's OK for bins to be empty. If you really like Butterflingers then you might not choose to get any Almond Soys at all ,for example.

Play with figure above, and try to realize two important things. Given that we leave the store with exactly 10 candies,
1. each new position for the separators gives a brand new candy distribution (so that we don't have to worry about overcounting).
2. by placing the separators in all the different possible places we leave no other possible candy distribution. That is, by moving the separators, we exhaust all the possible candy distributions.

These points are important to internalize so take your time and play with interactive until you have a good grasp of them.

### Mathematical Representation
All right! We are done with the second half of the problem: We know how to count the ways we can leave the store with a specific amount of candy. Let's put it all in mathematics.  
Let $n$ be the number of _candies_ we want to leave the store with.  
Let $k$ be the number of _types_ of candy we can choose. More precisely, let $k$ be the number of bins.    
Now, observe that we have 12 slots in the above sketch for 10 candies and 3 types. Why? Because we only need 2 separators to distinguish 3 types.  
So in general to solve a problem like this we would need $n + k - 1$ slots where we can move things around and be able to realize all the possible distributions.  
Finally, to count the ways we want to know how many different ways there are to put the 2 separators in 12 slots. That's $\binom{12}{2} = 66$.  
Generalized, we want to know how many ways there are to put $k-1$ separators in $n + k - 1$ slots, which is $n + k -1$ [choose](https://en.wikipedia.org/wiki/Binomial_coefficient) $k-1$:

$$\binom{n+k-1}{k-1}$$

## Back to the First Part of the Problem
Congratulations on coming this far! So far, we broke the problem into two parts and solved the second part which was to count the ways in which a certain of amount of candy can be distributed.

Let's recall that the original question wasn't about an exact number of candies but rather a range, namely $[1-100]$.

Now, we have the tools to calculate the ways for each number of candies within that range. The sum would give us the answer. We talked about this earlier. However, as we noted, we would need a computer to do this. Otherwise, it would be a real chore to sum them all up.

Prepare your mind to be blown.

### Second Change in Perspective  
<div align="right"><i>Change your heart, it will astound you<br>James Warren &ndash; The Korgis</i></div>

We're about to turn the problem into something that can be solved much more easily with sleight of hand. The sleight of hand is simply to reframe the problem. We could do this in a number of ways. My favorite way is to think in terms of (candy) tokens. When we enter the store we have 100 tokens some of which we may choose not to spend (but we are going to spend at least 1 as per the instructions of the problem).

Now, notice that the tokens that we choose not to spend belong to just another category like Almond Soys, Butterflingers, and so on. In other words, we can invest our tokens in Almond Soys, Butterflingers, Candy Kernels, or simply nothing.

With 4 categories, we would have 3 separators that could be represented with 13 slots for 10 tokens as below.

<div id="interactive2"></div>
<div class="fig-desc">Note that if you move the right-hand separator all the way to the right the first 12 slots will be identical to the figure above, representing all the possibilities where we use all the 10 tokens to get candy.</div>

Do you realize what we just did?! We don't need to sum all the different ways for candy counts of 1 through 100! The position of the left-hand separator handles all of that for us.

So if the question asked us if we were to leave the candy store with a maximum of 10 candies instead of 100, the above interactive would be the answer, with one caveat. We need to exclude the case where all of the tokens are invested in the empty bucket, i.e. the possibility where we leave the store with no candy whatsoever. That's only 1 such way of leaving the store so if we subtract 1 from all the ways of leaving the store, we have our answer.

### Mathematical Representation
We employ the same method as we did before to calculate the number of ways we can leave the store, except instead of 2, we now have 3 separators. So for, 10 tokens ($n = 10$), 4 bins for 3 types of candy and the option to not get any candy ($k = 4$), we have:

$$\binom{10 + 4 -1}{4 - 1} = 286$$

possible ways of leaving the store. Subtracting the unique possibility where we leave with no candy at all, gives 285 acceptable ways of leaving the store.

Generalizing this, we actually have the same equation as above:

$$\binom{n+k-1}{k-1}$$

But since we reframed the question, the same formula will do a different job for us, which once seemed extremely unwieldy. 

Going back to the original question:  
We have 100 tokens, $n = 100$.  
There are 3 kinds of candy.  
We can also use our tokens to not buy candies, as long as we buy at least 1.  
So, there are 4 bins where we can put our tokens ($k = 4$).

That means there are:

$$\binom{100 + 4 - 1}{4 - 1} = 176851$$

ways to leave the candy store. Leaving that one case where we leave with none we end up with $176850$ different ways of leaving the store.

One barely needs a calculator to compute that!

<script src="/assets/js/bose-einstein.js"></script>