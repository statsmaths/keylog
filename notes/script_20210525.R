library(tidyverse)
library(stringi)

# https://fr.wikipedia.org/wiki/G%C3%A9n%C3%A9tique_des_textes

cumpaste <- function(x, .sep = "")
  Reduce(function(x1, x2) paste(x1, x2, sep = .sep), x, accumulate = TRUE)

z <- read_csv("keylogs-1621879394023.csv")
z$time <- z$time - min(z$time)

keys <- z %>%
  group_by(key_code) %>%
  mutate(time_up = lead(time, n = 1), duration = time_up - time) %>%
  filter(type == "down") %>%
  ungroup() %>%
  #filter(stri_length(key) == 1) %>%
  mutate(cur_text = cumpaste(key)) %>%
  select(
    time_down = time,
    time_up,
    duration,
    key,
    key_code,
    cur_text,
    range_start,
    range_end
  )

keys %>%
  mutate(key = fct_inorder(key)) %>%
  mutate(rn = row_number()) %>%
  ggplot(aes(time, rn)) +
    geom_text(aes(label = key), size = 2) +
    theme_minimal()

keys %>%
  mutate(key = fct_inorder(key)) %>%
  mutate(rn = row_number()) %>%
  ggplot(aes(time, rn, color = modkey)) +
    geom_segment(aes(xend = time_up, yend = rn)) +
    geom_point() +
    geom_point(aes(x = time_up, y = rn)) +
    theme_minimal()

example_path <- system.file("keylogs-1621971722509.csv", package = "keylog")
dt <- klog_readfile(example_path)

# each row should be time stamps => let's say we focus on tokens
#                                => include current version of the text
#                                => sequences of arrows
#                                => suppressed items
#                                => paragraph id (where was it surpressed)
#                                => should try to find double entry keys
#                                => presumed number of paragraphs in the text
#
# the really cool thing? each sentence id is this the final version?
# what is the final version? let's add this as a final row

# June 9th  => 15h (Nicolas)
