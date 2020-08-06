---
layout: post
title:  "Linear Regression"
tags: mathematics statistics linear-regression python numpy scipy loss-function 
      cost-function fit best-fit animation animated interaction interactive
      elusive meditations
description: How do we determine what line best represents a big chunk of data?
             One of the tenets of statistics, linear regression,
             explained through interactive animations.
image: /assets/img/linear_regression_card.png
---


<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://unpkg.com/mathjs@7.0.2/dist/math.min.js"></script>
<div id="linregress0"></div>
<div align="center"><i>Go ahead and try drawing your own graph!</i></div>

## Motivation
Looking at the graph above, we see some dots representing data points, two, rather terse, axes, and a line that seems to go across all the dots. 


We see this sort of graph all the time. For instance, house prices increase as square-footage increases. Gas consumption increases as we drive more, and so on. But these relationships are never perfect in the real world.

The dots are scattered around because the data we collect is a function of a plethora of other factors. Take house prices. They are, indeed, affected by square-footage. But not only that! They are also affected by, for example, the proximity to a beach, how good neighboring schools are, how safe the neighborhood is, and maybe, even, how good of a bargainer the buyer is. And so forth. That is *noise*. Sometimes, we just want to find out the relationship between square-footage and price to guess the price of a house based on its square footage.

How do we do that? Simple. We fit a line across the dots, like the one above.

How do we "fit" a line across?
1. We could eyeball it. 
2. We could calculate, somehow, how well a certain line fits a certain set of dots. 

Now, the first option seems much easier. And in my experience, humans can eyeball a linear fit pretty well. In fact, at the end of the next section, you'll be able to test your skills, as well.

But this approach has some drawbacks. First of all, how can we tell that your eyeballing is better than mine? Also, what if we wanted to get really precise. And, perhaps most pressingly, what would happen if we needed to fit bazillions of lines to a bazillion different sets of dots. No one would want to eyeball each one of them!

The second option has some extra perks, too. There is a fairly simple rationale behind it and the concepts introduced play fundamental roles in all data analysis, including cutting edge machine learning. So, having an intuitive understanding of these concepts helps.

But, the most important perk of the second option? The result is frickin' beautiful! Let's get to it.

# Setup
The first order of business: I've talked about *how well* a line fits a set of dots. Let's talk about what 'how well' means in this context. In other words, let's talk about the error a line produces given a certain set of dots.
## Measuring Error
What is error? Here's a good measure: the difference between the actual house price, $y$, and the estimated price according to the fitted line, $\hat{y}$.

$$Error:=y - \hat{y}.$$

Great, we have calculated the error for a single point; it's just the vertical distance between the fitted line and the actual dot.
<!-- TODO: I need an image to right showing the difference, here -->
In what follows, we're going to work on extrapolating this idea for a single point to the whole data set.
## Squared Error
Our ultimate goal is to extend the error that we calculate from all of the single points to the whole line that we're generating. There might be a couple of ways of doing this. However, observe one thing first: Some dots are above the fitted line while some are below. If we sum all the errors together, positive errors would cancel out negative errors. An error is an error regardless of its sign. One error shouldn't cancel another!

That needs to be fixed. And, we could do a couple of things here, one of which, following the tradition, is squaring the errors. Voila! We've gotten rid of the negative signs:

$$Squred Error := (y-\hat{y})^2$$

## Sum of Squared Error (SSE)
Now we can sum all the squared errors without worrying about errors canceling each other out.
 
$\newcommand\SSE{\mathit{SSE}}$

$$\SSE = \sum_{i=1}^{n}{(y_i - \hat{y}_i)^2}$$


This is already a pretty good measure of how good the fit is; much better than what we started with.  
It's worth tweaking a little bit more, though.

## Root Mean Squared Error
Since we squared all the errors in the last step and took their sum, we've blown things out of proportion a little bit. Moreover, the unit of error is also the square of the unit of the original measurement of the dependent variable, so there's a mismatch there. We can fix these things by calculating the mean error and taking the square root of it.

$\newcommand\RMSE{\mathit{RMSE}}$

$$\RMSE = \sqrt{\frac{\SSE}{n}}$$

Okay, so in this setup section we've come up with a rigorous way of evaluating the fitness of a line for some dots. I want you to note that the most crucial step that we've taken here is the first one where we defined error as the vertical distance between the actual data and the fitted line. The rest is housekeeping. Next, we're going to try to find the *best* possible line that fits a set of dots.

But before we do all that, have a go below, try to fit a line by eyeballing it, and then by paying attention to the computed values that we just defined.

<div id="linregress1"></div>
<div align="center"><i>The left-hand handle modifies the intercept, the right-hand one modifies the slope.</i></div>

# Finding the Best Fit

*The less the error, the better the fit.  
The least the error, the best the fit.*

There are two fundamentally different ways of finding the line that fits the dots--as outlined above. One is applying brute force. We know how to calculate how good a fit our line is. We can get the computer to try thousands of different lines (using clever techniques) to get as good a fit as we can get. This is tantamount to *tweaking* in some sense. And it's exactly what you did if you tried to fit a line to the graph above. And it's fine. In fact, it's what machine learning is: clever tweaks at a *very* large scale!

Sometimes, though, there is the option for just finding *the* best-fitting line.

*"The"?* Not always an option, but we can, in this case, compute the best fitting line thanks to the magic of calculus.

## A small note, going forward
The following will be focused on finding the *best* line for a given set of dots. It turns out that trying to minimize $\RMSE$ and $\SSE$ are the same. So I'll minimize $\SSE$ in what follows for simplicity.

*(If you can't follow the calculus bits below, don't worry at all. Just skip to the end of this section where you'll see a graph in which you can compare the line that you fitted to the absolute best one.)*

## Calculus to the rescue
We want the line with the least sum of squared errors. In order to do that, we need to find out when the derivative of $\SSE$ equals 0, in other words, when the $\SSE$ hits a local *minimum*.

Remember:

$$\SSE = \sum_{i=1}^{n}{(y_i - \hat{y}_i)^2}$$

It turns out this is actually a pretty general formula for finding the SSE not just of linear models but all sorts of models. Since we're fitting a linear model, we can be a little bit more specific than this to go ahead with our calculations.  
In particular, since we are fitting a *line* to the whole dataset, we know that for any $\hat{y}_i$,  
$$\hat{y}_i = sx_i + b$$

After the corresponding substitution, we get:

$$\SSE = \sum_{i=1}^{n}{(y_i - sx_i - b)^2}$$

Now, we are going to find out the slope (s) and the bias (b) when $\SSE=0$. We're going to do that separately by taking partial derivatives of $\SSE$ with respect to each.

### Calculating b
Let's rewrite our formula and equate its derivative to 0.

$$0 = \frac{\partial \SSE}{\partial b}\left(\sum_{i=1}^{n}{(y_i - sx_i - b)^2}\right).$$

Using the chain rule, we get:

$$0 = \sum_{i=1}^{n}{-2(y_i - sx_i - b)}.$$

Pulling the '$-2$' out, and dividing each side by it:

$$0 = \sum_{i=1}^{n}{(y_i - sx_i - b)},$$

which evaluates to:

$$0 = \sum_{i=1}^{n}y_i - \sum_{i=1}^{n}sx_i - \sum_{i=1}^{n}b.$$


Since '$b$' and '$s$' are independent of $i$:

$$0 = \sum_{i=1}^{n}y_i - \sum_{i=1}^{n}sx_i - bn,$$

$$b = \frac{\sum_{i=1}^{n}y_i - s\sum_{i=1}^{n}x_i}{n}.$$

Look at it more closely:

$$b = \frac{\sum_{i=1}^{n}y_i}{n} - s\frac{\sum_{i=1}^{n}x_i}{n}.$$

And see the *means* in disguise:

$$b = \bar{Y} - s\bar{X}.$$

Clarification: We define $Y$ as an array of all $y_i$'s, and "$\bar{Y}$" (read "y bar") just means the mean of all $y_i$'s. 

Cool! But we still need to know the slope.

### Calculating s
Let's start just like before, but with $s$ instead of $b$.

$$0 = \frac{\partial \SSE}{\partial s}\left(\sum_{i=1}^{n}{(y_i - sx_i - b)^2}\right).$$

Using the chain rule, we get:

$$0 = \sum_{i=1}^{n}{-2x_i(y_i - sx_i - b)},$$

$$0 = \sum_{i=1}^{n}{x_i(y_i - sx_i - b)}.$$

Distributing $x_i$:

$$0 = \sum_{i=1}^{n}{(y_ix_i - sx_i^2 - bx_i)}$$

Substituting $b$ for what we found above:

$$0 = \sum_{i=1}^{n}{(y_ix_i - sx_i^2 - (\bar{Y} - s\bar{X})x_i)},$$

$$0 = \sum_{i=1}^{n}{(y_ix_i - sx_i^2 - \bar{Y}x_i + s\bar{X}x_i)},$$

$$0 = \sum_{i=1}^{n}{(x_iy_i - x_i\bar{Y}) - s\sum_{i=1}^{n}(x_i^2 - \bar{X}x_i)}.$$

Finally:

$$s = \frac{\sum_{i=1}^{n}(x_iy_i - x_i\bar{Y})}{\sum_{i=1}^{n}(x_i^2 - \bar{X}x_i)}.$$

And we've come to know the line that produces the least error! Remember, finding out the slope also lets us know what the intercept (b) is.

Again, don't worry if you weren't able to follow all that math. There's no need; all you need to realize is that the result now allows us to plot *the best* fitting line across the dots!

<div id="linregress2"></div>
<div align="center"><i>Here you can see how well the calculus-driven line does.<br>And you can see how well you can eyeball it, comparatively.<br>
Oh, you can also try plotting your own graph by dragging your mouse (or finger)!</i></div>


# Pythonification
In case you're wondering how to turn all of this into a computer program in Python. Here's how you'd do it. It's pretty neat to see all of what we've said above boils down to a few lines of code! And it comes up with the best possible line. Every time!

```python
from matplotlib import pyplot as plt
import numpy as np

def linear_regression(X,Y):
    Y_bar, X_bar = Y.mean(), X.mean()
    s = ((np.dot(X,Y) - np.dot(X, np.full(len(Y), Y_bar)))
        /(np.dot(X,X) - np.dot(X, np.full(len(Y), X_bar))))
    b = Y_bar - s*X_bar
    return s, b
```

## What does this look like in **SciPy**?
Well, **SciPy** has its own linear regression function, which works like so:

```python
from scipy import stats
slope, intercept, *rest = stats.linregress(X, Y)
```
Let's check out if the findings match.
```
                Slope		         Intercept
Scipy: 	 0.5666666666666669 	 3.4999999999999987
My func: 0.5666666666666667 	 3.5
```
They do... Cool!

## How about a race?
Let's race the two implementations of linear regression calculations!
```python
from time import time
# Have numpy create 2 arrays that are 1 million long, each.
x = np.random.random(1000000)
y = np.random.random(1000000)
tic = time()
slope, intercept, *rest = stats.linregress(x, y)
toc = time()
print(f"Scipy took: \t{(toc-tic)*1000}ms")

tic = time()
slope, intercept = linear_regression(x, y)
toc = time()
print(f"Our func took: \t{(toc-tic)*1000}ms")
```
```
Scipy took: 	21.461809158325195ms
Our func took: 	9.068489074707031ms
```
### **Whoa!!!**
Our function took significantly less time! About half... Considering that libraries like **SciPy** are optimized as hell for speed, this is a pretty decent feat!

**Uhmmm,** I guess I might have cheated a little, though. See that `*rest` when I called the **SciPy** function?  
```python
slope, intercept, *rest = stats.linregress(X, Y)
```
Well... That `*rest` contains the results of some other useful calculations like the correlation coefficient, which we didn't calculate at all. So, no wonder **SciPy** took more time!

**Nonetheless,** our function performed comparably to that of **SciPy.** I'll definitely take that as a success!
<script src="/assets/js/linregress.js"></script>