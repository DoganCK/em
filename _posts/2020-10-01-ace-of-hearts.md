---
layout: post
title:  "Ace of Hearts"
tags: mathematics statistics conditionalization deck-of-cards deck cards hearts spades clubs diamonds gambling probability animation animated interaction interactive elusive meditations
description: Why does knowing the suit of an ace matter when calculating probabilities that are indifferent to the suit in the first place? A key part to understanding conditionalization explained.
image: /assets/img/ace_of_hearts.png
---
![image](/assets/img/ace-of-hearts.svg)
We pick two cards out of a  standard well-shuffled deck. We know that one of them is the ace of hearts. What is the probability that we picked two aces?

In other words, what is the probability that you pick two aces from a deck of cards given that one that you pick is the ace of hearts?

$$P(\text{Two Aces | Have the Ace of Hearts}) = \text{ }?$$

Well, there are fifty-one cards left, three of which are aces. Each card has an equal probability of being picked. So with 3/51 probability, the other card will be an ace and hence we'll end up with two aces. Easy!

$$P(\text{Two Aces | Have the Ace of Hearts}) = \frac{3}{51} = \frac{1}{17}.$$

How about the following? This time we know that one of the cards is definitely an ace but we don't know what suit it is. Again, we don't know what the other card is. And we want to know the probability that we end up with two aces.

$$P(\text{Two Aces | Have an Ace}) = \text{ }?$$

* Is it the same?
* Higher?
* Lower?

What does your intuition tell you?

## On the face of it...

There is a strong intuition that pushes in the direction to say they'd have the same probability. After all, why on earth should knowing the suit of the ace matter?! The suit doesn't even figure into what we ultimately want to know&mdash;the probability of getting two aces. Let's call this **The Mathematical Puzzle**.

![image](/assets/img/matrix-spoon.jpg){: style="float: right" : width="30%"}To suggest that knowing the suit of the ace would change the odds almost sounds mystical. The odds shouldn't care about what we know. Knowledge is subjective and cannot affect how external events occur. If the odds change, then it sounds like we are affecting the world with our minds, much like the spoon-bending child from the Matrix. Spooky stuff! Let's call this one **The Philosophical Puzzle**.

I'll tackle these puzzles in reverse order.

### Resolving **The Philosophical Puzzle**
Well, probability can seem somewhat spooky like that sometimes. But this is understandable. Often when we talk about probabilities we talk about probabilities _given what we know_. Conditionalizing on our knowledge makes calculating probabilities a little spooky because it sits right between how the world actually is and how it is likely to be given our beliefs. (I dig deeper into this issue where I discuss [abductive reasoning](/abduction).)

In a similar fashion, the way I described the problem might sound in such a way that makes it look like we sort of knew the outcome of an experiment beforehand. It's a little weird to say that 'OK, we're about to pick two cards out of a deck and we know one of them is going to be the ace of hearts (or an ace). What is the probability that both are aces?'. It seems like some sort of prescience is sneaking into this particular formulation of the problem, doesn't it?

There is an easy way out if this puzzle: reformulate the problem. We could think of the problem as follows. How often is it that we get two aces among those picks that have at least one ace? Namely, what is the probability that we pick two aces, _given_ one of the cards is an ace?

Hopefully, it looks less spooky now!

### Resolving the **Mathematical Puzzle**
Why does knowing what suit the ace is matter at all? I promise the intuition for this is easily attained. But it does go into the heart of conditionalization, so I think it's also very important.

Let's forget about the 52-card deck and throw out every card except for the aces and 2's of the suits hearts and clubs. We're left with a 4-card deck. [image to the left with the 4 cards.]

And now let's think about the same two problems for the 4-card deck instead of 52. We can enumerate all the possibilities easily.

> What is the probability of getting two aces given one of the cards is the ace of hearts?  
AH, AC  
AH, 2H  
AH, 2C  
All three options are equiprobable, so there's 1 in 3 chance that we pick two aces.

>What is the probability of getting two aces given one of the cards is an ace?  
AH, AC  
AH, 2H  
AH, 2C  
AC, 2H  
AC, 2C  
Again all options are equiprobable, but there are 5 options now only one of which with two aces.

Spot the difference!

Not specifying the suit of the ace only added more ways to fail. In both cases, there is only one way of succeeding. But two ways of failing for the specified-suit case against 4 ways of failing in the unspecified-suit case.

The case for the 52-card deck isn't that much different. Not specifying the suit of the ace adds some more ways to succeed as well as adding more ways to fail. But it adds many more ways of failing than it does succeeding, proportionally.

Finally, let's move on to the analytical answer.

## The Answer

To reiterate the problem: What is the probability that we pick two aces given one of the cards is an ace?

$$P(\text{Two Aces | Have an Ace}) = \text{ }?$$

$$= \frac{P(\text{Two Aces }\cap\text{ Have an Ace})}
       {P(\text{Have an Ace})},$$

Since $\text{Two Aces} \subset \text{Have an Ace},$

$$= \frac{P(\text{Two Aces})}
       {P(\text{Have an Ace})}.$$
      
It's easier to calculate the possibility where there are no aces; so let's subtract the complement of the denominator from 1:

$$= \frac{P(\text{Two Aces})}
       {1 - P(\text{Zero Aces})},$$

$$= \frac{\binom{4}{2}/\binom{52}{2}}
       {1 - \binom{48}{2}/\binom{52}{2}}.$$

So,

$$P(\text{Two Aces | Have an Ace}) = \frac{1}{33}.$$

Do you remember what $P(\text{Two Aces \| Have the Ace of Hearts})$ was?

$$P(\text{Two Aces \| Have the Ace of Hearts}) = \frac{1}{17}.$$

Almost double!