require('isdals')
data(fev)

# Rename and convert height to cm
require('plyr')
fev <- rename(fev, c(Ht='Height'))
fev$Height <- cm(fev$Height)

# Interlude: Do the pca before codes are made into factors
pca <- prcomp(fev)

# Fixup the coding
fev$Gender <- as.factor( ifelse(fev$Gender==0, 'Female', 'Male') )
fev$Smoke  <- as.factor( ifelse(fev$Smoke==0, 'no', 'yes') )

summary(fev)

#write.csv(fev, 'fev.csv', row.names=F)

summary(pca)
plot(pca)
biplot(pca)

require('ggplot2')
ggplot(data=fev, aes(x=Age, y=FEV, colour=Smoke)) + geom_point() + geom_smooth()

ggplot(data=fev, aes(x=Age, y=FEV, colour=Smoke)) + geom_point() + geom_smooth(method=lm)